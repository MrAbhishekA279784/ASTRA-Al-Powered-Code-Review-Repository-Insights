import { initRouter, routeRequest, buildReviewPrompt, fetchGitHubJson, sendJson, parseBody, formatError } from '../src/lib/ai';

const apiKey = process.env.OPENROUTER_API_KEY || '';
if (apiKey) initRouter(apiKey);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  try {
    const body = parseBody(req);
    const { githubUrl } = body;

    console.log(`[ASTRA-REQ] /api/review-pr origin: vercel, url: ${githubUrl}`);
    if (!githubUrl) return sendJson(res, 400, { error: 'githubUrl is required.' });

    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!match) return sendJson(res, 400, { error: 'Invalid GitHub PR URL. Format: https://github.com/owner/repo/pull/123' });

    const [, owner, repo, pull_number] = match;

    let prData: any;
    try {
      prData = await fetchGitHubJson(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`);
    } catch (err: any) {
      return sendJson(res, 502, { error: `Failed to fetch PR from GitHub: ${err.message}` });
    }

    const diffRes = await fetch(prData.diff_url, { headers: { Accept: 'application/vnd.github.v3.diff' } });
    if (!diffRes.ok) return sendJson(res, diffRes.status, { error: 'Failed to fetch PR diff.' });
    let diffText = await diffRes.text();
    if (diffText.length > 30000) {
      console.log(`[ASTRA-REQ] Diff truncated: ${diffText.length} -> 30000 chars`);
      diffText = diffText.substring(0, 30000) + '\n\n... [diff truncated due to size]';
    }

    let filesData: any[] = [];
    try {
      filesData = await fetchGitHubJson(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/files`);
    } catch (err: any) {
      console.warn(`[ASTRA-REQ] Failed to fetch files: ${err.message}`);
    }
    if (Array.isArray(filesData) && filesData.length > 10) {
      filesData = filesData.sort((a: any, b: any) => (b.changes || 0) - (a.changes || 0)).slice(0, 10);
    }

    const prompt = buildReviewPrompt(prData, diffText);
    const reviewText = await routeRequest('review-pr', [{ role: 'user', content: prompt }], true);

    let reviewJson: any;
    try { reviewJson = JSON.parse(reviewText); }
    catch {
      console.error('[ASTRA] Failed to parse AI JSON response:', reviewText.substring(0, 500));
      reviewJson = { summary: reviewText, qualityScore: {}, issuesFound: [] };
    }

    return sendJson(res, 200, {
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
    const { statusCode, error: errMsg } = formatError(error);
    return sendJson(res, statusCode, { error: errMsg });
  }
}
