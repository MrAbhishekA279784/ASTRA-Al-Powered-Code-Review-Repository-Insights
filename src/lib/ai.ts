// ────────────────────────────────────────────────────────────
// Models
// ────────────────────────────────────────────────────────────
export const MODELS = {
  DEEPSEEK_CHAT: 'deepseek/deepseek-chat',
  QWEN_CODER: 'qwen/qwen-2.5-coder-32b-instruct',
  GEMINI_FLASH: 'google/gemini-2.0-flash-001',
} as const;

type ModelName = (typeof MODELS)[keyof typeof MODELS];

const FALLBACK_CHAIN: ModelName[] = [
  MODELS.DEEPSEEK_CHAT,
  MODELS.QWEN_CODER,
  MODELS.GEMINI_FLASH,
];

type AIRoute = 'review-pr' | 'generate-docs' | 'chat' | 'code-reasoning' | 'fix-suggestions';

const MODEL_ROUTES: Record<AIRoute, ModelName> = {
  'review-pr': MODELS.DEEPSEEK_CHAT,
  'generate-docs': MODELS.DEEPSEEK_CHAT,
  'chat': MODELS.DEEPSEEK_CHAT,
  'code-reasoning': MODELS.QWEN_CODER,
  'fix-suggestions': MODELS.QWEN_CODER,
};

// ────────────────────────────────────────────────────────────
// OpenRouter Provider
// ────────────────────────────────────────────────────────────
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';
const TIMEOUT_MS = 30000;

class OpenRouterError extends Error {
  type: string;
  constructor(message: string, type: string) {
    super(message);
    this.name = 'OpenRouterError';
    this.type = type;
  }
}

async function callOpenRouter(
  model: string,
  messages: { role: string; content: string }[],
  jsonMode: boolean,
  apiKey: string
): Promise<string> {
  console.log(`[AI] Provider: OpenRouter`);
  console.log(`[AI] Model: ${model}`);
  console.log(`[AI] Request Start`);

  const body: Record<string, unknown> = { model, messages };
  if (jsonMode) body.response_format = { type: 'json_object' };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(OPENROUTER_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    console.log(`[AI] Request Complete`);

    const contentType = res.headers.get('content-type') || '';

    if (!res.ok) {
      const errBody = await res.text();
      let errMsg: string;
      try { const parsed = JSON.parse(errBody); errMsg = parsed.error?.message || errBody; }
      catch { errMsg = errBody; }

      switch (res.status) {
        case 401: throw new OpenRouterError('Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY.', 'auth');
        case 402: throw new OpenRouterError('Insufficient credits on OpenRouter account.', 'quota');
        case 429: throw new OpenRouterError('Rate limit exceeded. Please wait and try again.', 'quota');
        case 503: throw new OpenRouterError(`Provider unavailable: ${errMsg.substring(0, 200)}`, 'unavailable');
        default:
          if (res.status >= 500) throw new OpenRouterError(`Provider error (${res.status}): ${errMsg.substring(0, 200)}`, 'unavailable');
          throw new OpenRouterError(errMsg.substring(0, 300), 'unknown');
      }
    }

    if (!contentType.includes('application/json')) {
      const text = await res.text();
      console.error('[AI] OpenRouter returned non-JSON:', { status: res.status, contentType, preview: text.substring(0, 300) });
      throw new OpenRouterError(`Provider returned unexpected response (${res.status})`, 'unavailable');
    }

    const data = await res.json();
    if (data.error) throw new OpenRouterError(data.error.message, 'provider');

    const content = data.choices?.[0]?.message?.content;
    if (!content || !content.trim()) throw new OpenRouterError('Empty response from model', 'empty');

    return content;
  } catch (err: unknown) {
    if (err instanceof OpenRouterError) throw err;
    const error = err as Error;
    if (error.name === 'AbortError') throw new OpenRouterError('Request timed out after 30s', 'timeout');
    throw new OpenRouterError(error.message || 'Unknown fetch error', 'network');
  } finally {
    clearTimeout(timeout);
  }
}

// ────────────────────────────────────────────────────────────
// Fallback Chain
// ────────────────────────────────────────────────────────────
const MAX_RETRIES_PER_PROVIDER = 1;

async function callWithFallback(
  initialModel: ModelName,
  messages: { role: string; content: string }[],
  jsonMode: boolean,
  apiKey: string
): Promise<string> {
  const startIndex = FALLBACK_CHAIN.indexOf(initialModel);
  if (startIndex === -1) throw new Error(`Unknown model: ${initialModel}`);

  let lastError: Error | null = null;

  for (let i = startIndex; i < FALLBACK_CHAIN.length; i++) {
    const model = FALLBACK_CHAIN[i];

    for (let attempt = 0; attempt <= MAX_RETRIES_PER_PROVIDER; attempt++) {
      try {
        return await callOpenRouter(model, messages, jsonMode, apiKey);
      } catch (err: unknown) {
        lastError = err as Error;
        if (err instanceof OpenRouterError) {
          console.warn(`[AI] ${model} attempt ${attempt + 1}/${MAX_RETRIES_PER_PROVIDER + 1} failed: ${err.message} (type: ${err.type})`);
          if (err.type === 'auth') throw err;
          if (err.type === 'quota') {
            if (i < FALLBACK_CHAIN.length - 1) { console.log(`[AI] Quota exceeded on ${model}, trying next provider`); break; }
            throw err;
          }
        } else {
          console.warn(`[AI] ${model} attempt ${attempt + 1}/${MAX_RETRIES_PER_PROVIDER + 1} failed: ${(err as Error).message}`);
        }
        if (attempt < MAX_RETRIES_PER_PROVIDER) console.log(`[AI] Retrying ${model}...`);
      }
    }

    if (i < FALLBACK_CHAIN.length - 1) console.log(`[AI] Falling back from ${model} to ${FALLBACK_CHAIN[i + 1]}`);
  }

  throw lastError || new Error('All AI providers failed');
}

// ────────────────────────────────────────────────────────────
// Router (Singleton)
// ────────────────────────────────────────────────────────────
let routerApiKey = '';

export function initRouter(apiKey: string): void {
  routerApiKey = apiKey;
  console.log(`[AI] Router initialized (key present: ${!!apiKey})`);
}

export async function routeRequest(
  route: AIRoute,
  messages: { role: string; content: string }[],
  jsonMode = false
): Promise<string> {
  if (!routerApiKey) throw new Error('AI router not initialized. Check OPENROUTER_API_KEY.');
  const model = MODEL_ROUTES[route];
  if (!model) throw new Error(`Unknown AI route: ${route}`);
  console.log(`[AI] Route: ${route} → model: ${model}`);
  return callWithFallback(model, messages, jsonMode, routerApiKey);
}

// ────────────────────────────────────────────────────────────
// Prompts
// ────────────────────────────────────────────────────────────
export function buildReviewPrompt(prData: { title: string; body?: string }, diffText: string): string {
  return `You are ASTRA, an AI code reviewer. Please review the following pull request diff.

PR Title: ${prData.title}
PR Body: ${prData.body || 'No description provided.'}

Diff:
${diffText}

Output the response EXACTLY as a JSON object with the following structure (no markdown, no code fences, raw JSON only):
{
  "summary": "A brief 2-3 sentence summary of what this PR does.",
  "qualityScore": {
    "overall": 85,
    "maintainability": 80,
    "readability": 90,
    "performance": 85,
    "security": 95
  },
  "issuesFound": [
    {
      "id": "1",
      "severity": "High",
      "title": "Short title of the issue",
      "description": "More detailed explanation.",
      "file": "path/to/file.ts"
    }
  ]
}`;
}

export function buildDocsPrompt(prTitle: string, prBody: string, diffSnippet: string): string {
  return `Based on the following PR title, description, and code diff, generate comprehensive documentation updates in Markdown.

Title: ${prTitle}
Body: ${prBody || 'No description provided.'}

Diff:
${diffSnippet}

Provide the response in clean Markdown format with appropriate headings, bullet points, and code blocks where relevant.`;
}

export function buildChatSystemInstruction(prData: { repo?: string; title?: string }, diffSnippet: string): string {
  return `You are ASTRA, an AI code assistant helping a user understand a pull request.

PR Info:
Repo: ${prData?.repo || 'Unknown'}
Title: ${prData?.title || 'Unknown'}

Diff Snippet:
${diffSnippet}

Please respond to the user's latest message based on this PR context. Keep responses concise and format in Markdown.`;
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────
export async function fetchGitHubJson(url: string): Promise<any> {
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

export function sendJson(res: any, status: number, data: any): void {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

export function parseBody(req: any): any {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); }
    catch { return {}; }
  }
  return {};
}

export function formatError(error: any): { statusCode: number; error: string } {
  const msg = error?.message || 'An unknown error occurred';
  console.error('[ASTRA API ERROR]', msg);

  if (msg.includes('API key') || msg.includes('OPENROUTER_API_KEY')) return { statusCode: 401, error: msg };
  if (msg.includes('quota') || msg.includes('credits') || msg.includes('Rate limit') || msg.includes('402')) return { statusCode: 429, error: msg };
  if (msg.includes('timeout') || msg.includes('Timed out')) return { statusCode: 504, error: 'AI request timed out. Please try again.' };
  if (msg.includes('unavailable') || msg.includes('Provider error') || msg.includes('503')) return { statusCode: 503, error: msg };
  if (msg.includes('GitHub API')) return { statusCode: 502, error: msg };

  return { statusCode: 500, error: msg };
}
