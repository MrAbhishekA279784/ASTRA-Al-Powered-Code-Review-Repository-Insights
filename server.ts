import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer as createViteServer } from "vite";
import { initRouter } from "./src/lib/ai/router.js";
import { createApp } from "./src/lib/ai/app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, ".env"), override: false });
dotenv.config({ path: path.resolve(__dirname, ".env.local"), override: true });

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

async function startServer() {
  const PORT = 3000;
  const app = createApp();

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
