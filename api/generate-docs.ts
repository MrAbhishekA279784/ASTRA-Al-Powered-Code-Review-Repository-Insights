import { initRouter, routeRequest, buildDocsPrompt, sendJson, parseBody, formatError } from '../src/lib/ai';

const apiKey = process.env.OPENROUTER_API_KEY || '';
if (apiKey) initRouter(apiKey);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  try {
    const body = parseBody(req);
    const { prTitle, prBody, diff } = body;

    console.log(`[ASTRA-REQ] /api/generate-docs origin: vercel, title: ${prTitle?.substring(0, 60)}`);
    if (!prTitle) return sendJson(res, 400, { error: 'prTitle is required.' });

    let diffSnippet = String(diff || '');
    if (diffSnippet.length > 15000) diffSnippet = diffSnippet.substring(0, 15000) + '\n\n... [diff truncated due to size]';

    const prompt = buildDocsPrompt(prTitle, prBody, diffSnippet);
    const markdown = await routeRequest('generate-docs', [{ role: 'user', content: prompt }]);
    return sendJson(res, 200, { markdown });
  } catch (error: any) {
    console.error(`[ASTRA] ERROR /api/generate-docs:`, { message: error?.message, name: error?.name, stack: error?.stack?.substring(0, 500) });
    const { statusCode, error: errMsg } = formatError(error);
    return sendJson(res, statusCode, { error: errMsg });
  }
}
