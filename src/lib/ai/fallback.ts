import { callOpenRouter, OpenRouterError } from './provider.js';
import { FALLBACK_CHAIN, type ModelName } from './models.js';

const MAX_RETRIES_PER_PROVIDER = 1;

export async function callWithFallback(
  initialModel: ModelName,
  messages: { role: string; content: string }[],
  jsonMode: boolean,
  apiKey: string
): Promise<string> {
  const startIndex = FALLBACK_CHAIN.indexOf(initialModel);
  if (startIndex === -1) {
    throw new Error(`Unknown model: ${initialModel}`);
  }

  let lastError: Error | null = null;

  for (let i = startIndex; i < FALLBACK_CHAIN.length; i++) {
    const model = FALLBACK_CHAIN[i];

    for (let attempt = 0; attempt <= MAX_RETRIES_PER_PROVIDER; attempt++) {
      try {
        return await callOpenRouter(model, messages, jsonMode, apiKey);
      } catch (err: unknown) {
        lastError = err as Error;

        if (err instanceof OpenRouterError) {
          console.warn(
            `[AI] ${model} attempt ${attempt + 1}/${MAX_RETRIES_PER_PROVIDER + 1} failed: ${err.message} (type: ${err.type})`
          );

          if (err.type === 'auth') {
            console.error(`[AI] Auth failure — stopping all retries`);
            throw err;
          }

          if (err.type === 'quota') {
            if (i < FALLBACK_CHAIN.length - 1) {
              console.log(`[AI] Quota exceeded on ${model}, trying next provider`);
              break;
            }
            throw err;
          }
        } else {
          console.warn(
            `[AI] ${model} attempt ${attempt + 1}/${MAX_RETRIES_PER_PROVIDER + 1} failed: ${(err as Error).message}`
          );
        }

        if (attempt < MAX_RETRIES_PER_PROVIDER) {
          console.log(`[AI] Retrying ${model}...`);
        }
      }
    }

    if (i < FALLBACK_CHAIN.length - 1) {
      console.log(`[AI] Falling back from ${model} to ${FALLBACK_CHAIN[i + 1]}`);
    }
  }

  throw lastError || new Error('All AI providers failed');
}
