export function buildReviewPrompt(
  prData: { title: string; body?: string },
  diffText: string
): string {
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

export function buildDocsPrompt(
  prTitle: string,
  prBody: string,
  diffSnippet: string
): string {
  return `Based on the following PR title, description, and code diff, generate comprehensive documentation updates in Markdown.

Title: ${prTitle}
Body: ${prBody || 'No description provided.'}

Diff:
${diffSnippet}

Provide the response in clean Markdown format with appropriate headings, bullet points, and code blocks where relevant.`;
}

export function buildChatSystemInstruction(
  prData: { repo?: string; title?: string },
  diffSnippet: string
): string {
  return `You are ASTRA, an AI code assistant helping a user understand a pull request.

PR Info:
Repo: ${prData?.repo || 'Unknown'}
Title: ${prData?.title || 'Unknown'}

Diff Snippet:
${diffSnippet}

Please respond to the user's latest message based on this PR context. Keep responses concise and format in Markdown.`;
}
