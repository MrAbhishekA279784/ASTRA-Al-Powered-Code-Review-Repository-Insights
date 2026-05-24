import { initRouter, routeRequest, buildChatSystemInstruction, sendJson, parseBody, formatError } from '../src/lib/ai';

const apiKey = process.env.OPENROUTER_API_KEY || '';
if (apiKey) initRouter(apiKey);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  try {
    const body = parseBody(req);
    const { message, diff, prData, history } = body;

    console.log(`[ASTRA-REQ] /api/chat origin: vercel, message: ${message?.substring(0, 60)}`);
    if (!message) return sendJson(res, 400, { error: 'message is required.' });

    let diffSnippet = String(diff || '');
    if (diffSnippet.length > 5000) diffSnippet = diffSnippet.substring(0, 5000) + '\n\n... [diff truncated]';

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
    return sendJson(res, 200, { text });
  } catch (error: any) {
    console.error(`[ASTRA] ERROR /api/chat:`, { message: error?.message, name: error?.name, stack: error?.stack?.substring(0, 500) });
    const { statusCode, error: errMsg } = formatError(error);
    return sendJson(res, statusCode, { error: errMsg });
  }
}
