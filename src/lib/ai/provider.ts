const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';
const TIMEOUT_MS = 30000;

export class OpenRouterError extends Error {
  type: string;
  constructor(message: string, type: string) {
    super(message);
    this.name = 'OpenRouterError';
    this.type = type;
  }
}

interface OpenRouterMessage {
  role: string;
  content: string;
}

interface OpenRouterChoice {
  message: { content: string };
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
  error?: { message: string };
}

export async function callOpenRouter(
  model: string,
  messages: OpenRouterMessage[],
  jsonMode: boolean,
  apiKey: string
): Promise<string> {
  console.log(`[AI] Provider: OpenRouter`);
  console.log(`[AI] Model: ${model}`);
  console.log(`[AI] Request Start`);

  const body: Record<string, unknown> = {
    model,
    messages,
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

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

    if (!res.ok) {
      const errBody = await res.text();
      let errMsg: string;
      try {
        const parsed = JSON.parse(errBody);
        errMsg = parsed.error?.message || errBody;
      } catch {
        errMsg = errBody;
      }

      switch (res.status) {
        case 401:
          throw new OpenRouterError(
            'Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY.',
            'auth'
          );
        case 402:
          throw new OpenRouterError('Insufficient credits on OpenRouter account.', 'quota');
        case 429:
          throw new OpenRouterError('Rate limit exceeded. Please wait and try again.', 'quota');
        case 503:
          throw new OpenRouterError(
            `Provider unavailable: ${errMsg.substring(0, 200)}`,
            'unavailable'
          );
        default:
          if (res.status >= 500) {
            throw new OpenRouterError(
              `Provider error (${res.status}): ${errMsg.substring(0, 200)}`,
              'unavailable'
            );
          }
          throw new OpenRouterError(errMsg.substring(0, 300), 'unknown');
      }
    }

    const data: OpenRouterResponse = await res.json();

    if (data.error) {
      throw new OpenRouterError(data.error.message, 'provider');
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content || !content.trim()) {
      throw new OpenRouterError('Empty response from model', 'empty');
    }

    return content;
  } catch (err: unknown) {
    if (err instanceof OpenRouterError) throw err;
    const error = err as Error;
    if (error.name === 'AbortError') {
      throw new OpenRouterError('Request timed out after 30s', 'timeout');
    }
    throw new OpenRouterError(error.message || 'Unknown fetch error', 'network');
  } finally {
    clearTimeout(timeout);
  }
}
