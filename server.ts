import * as dotenv from "dotenv";
import path from "path";
import express from "express";
import { createServer as createViteServer } from "vite";
import { initRouter, routeRequest, buildReviewPrompt, buildDocsPrompt, buildChatSystemInstruction, fetchGitHubJson } from "./src/lib/ai.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: false });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

console.log("[ASTRA] Env check — OPENROUTER_API_KEY loaded:", !!OPENROUTER_API_KEY);
console.log("[ASTRA] Env check — key length:", OPENROUTER_API_KEY?.length || 0);

if (!OPENROUTER_API_KEY) {
  console.error(
    "[ASTRA] FATAL: OPENROUTER_API_KEY is not set.\n" +
    "  Create .env.local with: OPENROUTER_API_KEY=sk-or-...\n" +
    "  See .env.example for the format."
  );
  process.exit(1);
}

initRouter(OPENROUTER_API_KEY);

process.on("unhandledRejection", (reason, promise) => {
  console.error("[ASTRA] Unhandled Rejection at:", promise, "reason:", reason);
});

function handleError(error: any, res: any, context: string): void {
  const msg = error?.message || '';
  console.error(`[ASTRA] ERROR in ${context}:`, { message: msg, name: error?.name, type: error?.type });
  if (res?.headersSent) return;
  if (msg.includes('API key') || msg.includes('OPENROUTER_API_KEY')) return void res.status(401).json({ error: msg });
  if (msg.includes('quota') || msg.includes('credits') || msg.includes('Rate limit') || msg.includes('402')) return void res.status(429).json({ error: msg });
  if (msg.includes('timeout') || msg.includes('Timed out')) return void res.status(504).json({ error: 'AI request timed out. Please try again.' });
  if (msg.includes('unavailable') || msg.includes('Provider error') || msg.includes('503')) return void res.status(503).json({ error: msg || 'AI provider is temporarily unavailable. Please try again.' });
  if (msg.includes('GitHub API')) return void res.status(502).json({ error: msg });
  res.status(500).json({ error: msg || 'An unknown AI error occurred.' });
}

async function startServer() {
  const PORT = 3000;
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // ─── CORS ─────────────────────────────────────────────────────────────────────
  const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://astra-ai-review.vercel.app',
    'https://astra-ai-code-review.vercel.app',
    process.env.CLIENT_ORIGIN || '',
  ].filter(Boolean);

  app.use((_req, res, next) => {
    const origin = _req.headers.origin || '';
    if (ALLOWED_ORIGINS.includes(origin) || !origin) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    if (_req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // ─── Route: Review PR ────────────────────────────────────────────────────────
  app.post('/api/review-pr', async (req, res) => {
    try {
      const { githubUrl } = req.body;
      console.log(`[ASTRA-REQ] /api/review-pr origin: client, url: ${githubUrl}`);
      if (!githubUrl) return res.status(400).json({ error: 'githubUrl is required.' });

      const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
      if (!match) return res.status(400).json({ error: 'Invalid GitHub PR URL. Format: https://github.com/owner/repo/pull/123' });

      const [, owner, repo, pull_number] = match;
      let prData: any;
      try { prData = await fetchGitHubJson(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`); }
      catch (err: any) { return res.status(502).json({ error: `Failed to fetch PR from GitHub: ${err.message}` }); }

      const diffRes = await fetch(prData.diff_url, { headers: { Accept: 'application/vnd.github.v3.diff' } });
      if (!diffRes.ok) return res.status(diffRes.status).json({ error: 'Failed to fetch PR diff.' });
      let diffText = await diffRes.text();
      if (diffText.length > 30000) { diffText = diffText.substring(0, 30000) + '\n\n... [diff truncated due to size]'; }

      let filesData: any[] = [];
      try { filesData = await fetchGitHubJson(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/files`); }
      catch { /* non-fatal */ }
      if (Array.isArray(filesData) && filesData.length > 10) filesData = filesData.sort((a: any, b: any) => (b.changes || 0) - (a.changes || 0)).slice(0, 10);

      const prompt = buildReviewPrompt(prData, diffText);
      const reviewText = await routeRequest('review-pr', [{ role: 'user', content: prompt }], true);
      let reviewJson: any;
      try { reviewJson = JSON.parse(reviewText); }
      catch { reviewJson = { summary: reviewText, qualityScore: {}, issuesFound: [] }; }

      return res.json({ prData: { title: prData.title, repo: `${owner}/${repo}`, base: prData.base.ref, head: prData.head.ref, additions: prData.additions, deletions: prData.deletions, changedFiles: prData.changed_files, commits: prData.commits, diff: diffText, files: filesData }, review: reviewJson });
    } catch (error: any) {
      console.error(`[ASTRA] ERROR /api/review-pr:`, { message: error?.message, name: error?.name, stack: error?.stack?.substring(0, 500) });
      handleError(error, res, '/api/review-pr');
    }
  });

  // ─── Route: Generate Docs ────────────────────────────────────────────────────
  app.post('/api/generate-docs', async (req, res) => {
    try {
      const { prTitle, prBody, diff } = req.body;
      console.log(`[ASTRA-REQ] /api/generate-docs origin: client, title: ${prTitle?.substring(0, 60)}`);
      if (!prTitle) return res.status(400).json({ error: 'prTitle is required.' });

      let diffSnippet = String(diff || '');
      if (diffSnippet.length > 15000) diffSnippet = diffSnippet.substring(0, 15000) + '\n\n... [diff truncated due to size]';

      const prompt = buildDocsPrompt(prTitle, prBody, diffSnippet);
      const markdown = await routeRequest('generate-docs', [{ role: 'user', content: prompt }]);
      return res.json({ markdown });
    } catch (error: any) {
      console.error(`[ASTRA] ERROR /api/generate-docs:`, { message: error?.message, name: error?.name, stack: error?.stack?.substring(0, 500) });
      handleError(error, res, '/api/generate-docs');
    }
  });

  // ─── Route: Chat ─────────────────────────────────────────────────────────────
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, diff, prData, history } = req.body;
      console.log(`[ASTRA-REQ] /api/chat origin: client, message: ${message?.substring(0, 60)}`);
      if (!message) return res.status(400).json({ error: 'message is required.' });

      let diffSnippet = String(diff || '');
      if (diffSnippet.length > 5000) diffSnippet = diffSnippet.substring(0, 5000) + '\n\n... [diff truncated]';

      const systemInstruction = buildChatSystemInstruction(prData, diffSnippet);
      const chatMessages = [
        { role: 'system', content: systemInstruction },
        ...(history || []).map((h: any) => ({ role: h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user', content: h.content })),
        { role: 'user', content: message },
      ];
      const text = await routeRequest('chat', chatMessages);
      return res.json({ text });
    } catch (error: any) {
      console.error(`[ASTRA] ERROR /api/chat:`, { message: error?.message, name: error?.name, stack: error?.stack?.substring(0, 500) });
      handleError(error, res, '/api/chat');
    }
  });

  // ─── Catch-all for unmatched API routes ─────────────────────────────────────
  app.use('/api/*', (_req, res) => { res.status(404).json({ error: 'API endpoint not found.' }); });

  // ─── Vite / Static Serving ───────────────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ASTRA] Server running on http://localhost:${PORT}`);
    console.log(`[ASTRA] AI active via OpenRouter (fallback: DeepSeek Chat → Qwen Coder → Gemini Flash)`);
    console.log(`[ASTRA] API key present: ${OPENROUTER_API_KEY ? "YES ✓" : "NO ✗ — set OPENROUTER_API_KEY in .env.local"}`);
  });
}

startServer().catch((err) => {
  console.error("[ASTRA] Failed to start server:", err);
  process.exit(1);
});
