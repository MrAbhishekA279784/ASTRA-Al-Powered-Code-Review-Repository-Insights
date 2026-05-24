import { initRouter } from '../src/lib/ai/router.js';
import { createApp } from '../src/lib/ai/app.js';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error('[ASTRA] Vercel: OPENROUTER_API_KEY is not set in environment variables.');
}

initRouter(OPENROUTER_API_KEY || '');

const app = createApp();

export default app;
