import express from 'express';
import { routeRequest } from './router.js';
import {
  buildReviewPrompt,
  buildDocsPrompt,
  buildChatSystemInstruction,
} from './prompts.js';

function handleError(error: any, res: any, context: string): void {
  const msg = error?.message || '';
  console.error(`[ASTRA] ERROR in ${context}:`, {
    message: msg,
    name: error?.name,
    type: error?.type,
  });

  if (res?.headersSent) return;

  if (msg.includes('API key') || msg.includes('OPENROUTER_API_KEY')) {
    return res.status(401).json({ error: msg });
  }
  if (msg.includes('quota') || msg.includes('credits') || msg.includes('Rate limit') || msg.includes('402')) {
    return res.status(429).json({ error: msg });
  }
  if (msg.includes('timeout') || msg.includes('Timed out')) {
    return res.status(504).json({ error: 'AI request timed out. Please try again.' });
  }
  if (msg.includes('unavailable') || msg.includes('Provider error') || msg.includes('503')) {
    return res.status(503).json({ error: msg || 'AI provider is temporarily unavailable. Please try again.' });
  }

  res.status(500).json({ error: msg || 'An unknown AI error occurred.' });
}

async function fetchGitHubJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github.v3+json' } });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('[ASTRA] GitHub API returned non-JSON:', { url, status: res.status, preview: text.substring(0, 200) });
    throw new Error(`GitHub API error (${res.status})`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(`GitHub API error: ${data.message || res.status}`);
  return data;
}

export function createApp(): express.Express {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // ─── Route: Review PR ────────────────────────────────────────────────────────
  app.post('/api/review-pr', async (req, res) => {
    try {
      const { githubUrl } = req.body;
      console.log(`[ASTRA-REQ] /api/review-pr origin: client, url: ${githubUrl}`);
      if (!githubUrl) {
        return res.status(400).json({ error: 'githubUrl is required.' });
      }

      const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
      if (!match) {
        return res.status(400).json({
          error: 'Invalid GitHub PR URL. Format: https://github.com/owner/repo/pull/123',
        });
      }

      const [, owner, repo, pull_number] = match;

      let prData: any;
      try {
        prData = await fetchGitHubJson(
          `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`
        );
      } catch (err: any) {
        return res.status(502).json({ error: `Failed to fetch PR from GitHub: ${err.message}` });
      }

      const diffRes = await fetch(prData.diff_url, {
        headers: { Accept: 'application/vnd.github.v3.diff' },
      });
      if (!diffRes.ok) {
        return res.status(diffRes.status).json({ error: 'Failed to fetch PR diff.' });
      }
      let diffText = await diffRes.text();

      if (diffText.length > 30000) {
        console.log(`[ASTRA-REQ] Diff truncated: ${diffText.length} -> 30000 chars`);
        diffText = diffText.substring(0, 30000) + '\n\n... [diff truncated due to size]';
      }

      let filesData: any[] = [];
      try {
        filesData = await fetchGitHubJson(
          `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/files`
        );
      } catch (err: any) {
        console.warn(`[ASTRA-REQ] Failed to fetch files: ${err.message}`);
      }
      if (Array.isArray(filesData) && filesData.length > 10) {
        filesData = filesData
          .sort((a: any, b: any) => (b.changes || 0) - (a.changes || 0))
          .slice(0, 10);
        console.log(`[ASTRA-REQ] Files limited: top 10 of ${filesData.length} prioritized`);
      }

      const prompt = buildReviewPrompt(prData, diffText);

      const reviewText = await routeRequest('review-pr', [
        { role: 'user', content: prompt },
      ], true);

      let reviewJson: any;
      try {
        reviewJson = JSON.parse(reviewText);
      } catch {
        console.error('[ASTRA] Failed to parse AI JSON response:', reviewText.substring(0, 500));
        reviewJson = { summary: reviewText, qualityScore: {}, issuesFound: [] };
      }

      return res.json({
        prData: {
          title: prData.title,
          repo: `${owner}/${repo}`,
          base: prData.base.ref,
          head: prData.head.ref,
          additions: prData.additions,
          deletions: prData.deletions,
          changedFiles: prData.changed_files,
          commits: prData.commits,
          diff: diffText,
          files: filesData,
        },
        review: reviewJson,
      });
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
      if (!prTitle) {
        return res.status(400).json({ error: 'prTitle is required.' });
      }

      let diffSnippet = String(diff || '');
      if (diffSnippet.length > 15000) {
        diffSnippet = diffSnippet.substring(0, 15000) + '\n\n... [diff truncated due to size]';
      }

      const prompt = buildDocsPrompt(prTitle, prBody, diffSnippet);

      const markdown = await routeRequest('generate-docs', [
        { role: 'user', content: prompt },
      ]);

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
      if (!message) {
        return res.status(400).json({ error: 'message is required.' });
      }

      let diffSnippet = String(diff || '');
      if (diffSnippet.length > 5000) {
        diffSnippet = diffSnippet.substring(0, 5000) + '\n\n... [diff truncated]';
      }

      const systemInstruction = buildChatSystemInstruction(prData, diffSnippet);

      const chatMessages = [
        { role: 'system', content: systemInstruction },
        ...(history || []).map((h: any) => ({
          role: h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user',
          content: h.content,
        })),
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
  app.use('/api/*', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  return app;
}
