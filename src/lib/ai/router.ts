import { MODEL_ROUTES, type AIRoute, type ModelName } from './models.js';
import { callWithFallback } from './fallback.js';

let routerApiKey = '';

export function initRouter(apiKey: string): void {
  routerApiKey = apiKey;
  console.log(`[AI] Router initialized (key present: ${!!apiKey})`);
}

export function getRouterApiKey(): string {
  return routerApiKey;
}

export async function routeRequest(
  route: AIRoute,
  messages: { role: string; content: string }[],
  jsonMode = false
): Promise<string> {
  if (!routerApiKey) {
    throw new Error('AI router not initialized. Check OPENROUTER_API_KEY.');
  }

  const model: ModelName = MODEL_ROUTES[route];
  if (!model) {
    throw new Error(`Unknown AI route: ${route}`);
  }

  console.log(`[AI] Route: ${route} → model: ${model}`);
  return callWithFallback(model, messages, jsonMode, routerApiKey);
}
