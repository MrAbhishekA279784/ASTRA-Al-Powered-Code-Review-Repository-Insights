import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Review PR
  app.post("/api/review-pr", async (req, res) => {
    try {
      const { githubUrl } = req.body;
      
      // Parse githubUrl (e.g. https://github.com/owner/repo/pull/123)
      const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
      if (!match) {
        return res.status(400).json({ error: "Invalid GitHub PR URL. Format needs to be https://github.com/owner/repo/pull/123" });
      }

      const owner = match[1];
      const repo = match[2];
      const pull_number = match[3];

      // Fetch PR metadata
      const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`, {
        headers: { "Accept": "application/vnd.github.v3+json" }
      });
      
      if (!prRes.ok) {
        return res.status(prRes.status).json({ error: "Failed to fetch PR from GitHub." });
      }

      const prData = await prRes.json();

      // Fetch the diff
      const diffRes = await fetch(prData.diff_url, {
        headers: { "Accept": "application/vnd.github.v3.diff" }
      });

      if (!diffRes.ok) {
         return res.status(diffRes.status).json({ error: "Failed to fetch PR diff." });
      }

      const diffText = await diffRes.text();

      // Fetch the files
      const filesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/files`, {
        headers: { "Accept": "application/vnd.github.v3+json" }
      });
      const filesData = await filesRes.json();
      
      // Now, use Gemini to review the code
      const prompt = `
        You are ASTRA, an AI code reviewer. Please review the following pull request diff.
        
        PR Title: ${prData.title}
        PR Body: ${prData.body || "No description provided."}
        
        Diff:
        ${diffText.substring(0, 50000)} // truncate to avoid massive payloads
        
        Output the response EXACTLY as a JSON object with the following structure:
        {
          "summary": "A brief 2-3 sentence summary of what this PR does via your analysis.",
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
               "severity": "High" (or "Medium", "Low", "Info"),
               "title": "Short title of the issue",
               "description": "More detailed explanation of the issue.",
               "file": "path/to/file.ts"
             }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const reviewText = response.text || "{}";
      const reviewJson = JSON.parse(reviewText);

      res.json({
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
          files: filesData
        },
        review: reviewJson
      });
      
    } catch (error: any) {
      console.error("Error reviewing PR:", error);
      res.status(500).json({ error: error.message || "Failed to analyze PR." });
    }
  });
  
  // API Route: generate markdown documentation given PR changes
  app.post("/api/generate-docs", async (req, res) => {
    try {
      const { prTitle, prBody, diff } = req.body;
      
      const prompt = `
        Based on the following PR title, description, and code diff, generate comprehensive documentation updates in markdown.
        
        Title: ${prTitle}
        Body: ${prBody}
        
        Diff:
        ${String(diff).substring(0, 30000)}
        
        Provide the response in Markdown format.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt
      });

      res.json({ markdown: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Error generating docs" });
    }
  });

  // API Route: AI Chat regarding the PR
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, diff, prData, history } = req.body;
      
      const systemInstruction = `
        You are ASTRA, an AI code assistant helping a user understand a pull request.
        
        PR Info:
        Repo: ${prData?.repo}
        Title: ${prData?.title}
        
        Diff Snippet:
        ${String(diff).substring(0, 10000)}
        
        Please respond to the user's latest message based on this PR context. Keep responses concise and formatting in markdown.
      `;

      // Build chat history
      const formattedHistory = (history || []).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));
      
      // We will do a regular generateContent but constructing history manually
      const chatContents = [...formattedHistory, { role: "user", parts: [{ text: message }] }];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: chatContents,
        config: {
          systemInstruction: systemInstruction
        }
      });

      res.json({ text: response.text });
    } catch (e: any) {
      console.error("Chat error:", e);
      res.status(500).json({ error: e.message || "Chat failed" });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
