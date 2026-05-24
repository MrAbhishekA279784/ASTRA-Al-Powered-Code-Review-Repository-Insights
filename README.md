<div align="center">

<br/>

```
 ██████╗ ███████╗████████╗██████╗  █████╗
██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
███████║███████╗   ██║   ██████╔╝███████║
██╔══██║╚════██║   ██║   ██╔══██╗██╔══██║
██║  ██║███████║   ██║   ██║  ██║██║  ██║
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
```

**AI-Powered System for Technical Review & Analysis**

*The code reviewer that never sleeps, never gets tired, and never says LGTM without meaning it.*

<br/>

[![Stars](https://img.shields.io/github/stars/astra-ai/astra?style=flat-square&color=7C3AED&labelColor=0A0A0F&label=⭐%20Stars)](https://github.com/astra-ai/astra)
[![License](https://img.shields.io/badge/License-MIT-7C3AED?style=flat-square&labelColor=0A0A0F)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-7C3AED?style=flat-square&labelColor=0A0A0F)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-7C3AED?style=flat-square&labelColor=0A0A0F)](https://typescriptlang.org)

<br/>

</div>

---

## What is ASTRA?

ASTRA is an AI-powered pull request review platform built for developers who care about shipping quality code fast. Connect your GitHub, point it at a PR, and get back an instant, structured review — security issues flagged, performance bottlenecks identified, code smells surfaced, documentation auto-generated.

No setup friction. No generic "looks good to me." Just precise, actionable feedback in seconds.

Built with the same obsessive attention to developer experience as Cursor, Linear, and Raycast. Feels like a tool made by engineers, for engineers.

---

## Features

### AI Code Review

ASTRA analyzes your entire pull request diff and returns a structured, severity-ranked list of findings. Not generic suggestions — specific issues with exact file references, line numbers, and fix suggestions.

- **Bug detection** — logic errors, edge case misses, null pointer risks
- **Security analysis** — hardcoded secrets, injection vulnerabilities, unsafe auth patterns, exposed env vars
- **Performance flags** — inefficient loops, unnecessary re-renders, redundant API calls, O(n²) operations
- **Code smell detection** — dead code, overly complex functions, naming inconsistencies
- **Maintainability scoring** — readability, documentation gaps, coupling analysis

Every issue comes with: a severity level (`critical` / `major` / `minor` / `info`), the exact file and line, a plain-English explanation, and a concrete fix suggestion.

### Code Quality Score

After every analysis, ASTRA computes a **0–100 quality score** broken down across five dimensions:

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Security | 30% | Vulnerability count and severity |
| Maintainability | 25% | Code structure and complexity |
| Performance | 20% | Efficiency of algorithms and patterns |
| Readability | 15% | Naming, clarity, and style |
| Best Practices | 10% | Standards adherence |

### Documentation Intelligence

ASTRA reads your diff and auto-generates four documentation artifacts:

- **README Updates** — detects API/interface changes and suggests updated sections
- **API Documentation** — extracts new or modified endpoints and generates OpenAPI-style docs
- **Changelog Entry** — formats a Keep a Changelog entry from the PR's changes
- **Onboarding Notes** — plain-English summary of what this feature does and how it works

Each artifact streams in real time and can be copied as GitHub-flavored markdown.

### ASTRA Chat

Once a PR is analyzed, ask ASTRA anything about it. The full diff and all review findings are injected as context, so answers are specific to *your* code — not generic AI responses.

> "Why is the JWT signing on line 31 flagged?"
> "Show me a safer version of the auth controller."
> "What's the highest-risk file in this PR?"

### Multi-Model AI

ASTRA uses a smart provider fallback system:

| Priority | Provider | Model | Used For |
|----------|----------|-------|----------|
| Primary | Google | Gemini 2.0 Flash | Main analysis (1M token context) |
| Fallback 1 | OpenRouter | DeepSeek Chat | If Gemini times out |
| Fallback 2 | OpenRouter | Qwen 2.5 Coder | Code-specific tasks |

If the primary model fails or times out (> 15 seconds), the system automatically retries with the fallback. No failed reviews.

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript** — strict mode, full type safety
- **Vite** — sub-second HMR, optimized production builds
- **Tailwind CSS** — utility-first, JIT compiler
- **Framer Motion** — production-grade animations and transitions
- **Monaco Editor** — VSCode-quality split-diff viewer with syntax highlighting
- **Lucide Icons** — consistent, tree-shakeable icon set

### Backend
- **Node.js** + **Express.js** — lightweight API server
- **Zod** — schema validation on all inputs and AI outputs

### AI Layer
- **OpenRouter API** — multi-model routing (DeepSeek, Qwen)
- **Google Gemini API** — primary analysis model

### Authentication
- **Firebase Authentication** — Google OAuth, GitHub OAuth, email/password
- Persistent sessions with secure token refresh

### Infrastructure
- **Vercel** — frontend deployment (global CDN, edge functions)
- **Railway** — backend deployment (auto-scaling, zero-config)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
│  React + Vite (Vercel CDN)                         │
└──────────────────────┬──────────────────────────────┘
                       │  REST API calls
                       ▼
┌─────────────────────────────────────────────────────┐
│              RAILWAY BACKEND                        │
│  Express.js API Server                              │
│                                                     │
│  POST /api/analyze   → PR diff processing           │
│  POST /api/chat      → Contextual chat              │
│  POST /api/docs      → Documentation generation     │
└────────────┬────────────────────┬───────────────────┘
             │                    │
             ▼                    ▼
┌────────────────────┐  ┌─────────────────────────────┐
│  Google Gemini API │  │  OpenRouter API             │
│  gemini-2.0-flash  │  │  deepseek/deepseek-chat     │
│  (Primary)         │  │  qwen/qwen-2.5-coder        │
│                    │  │  (Fallback)                 │
└────────────────────┘  └─────────────────────────────┘
```

**Analysis Pipeline:**

```
GitHub PR URL → Fetch unified diff → Filter noise (lock files, generated)
    → Chunk by token limit → Build analysis prompt
    → Stream to AI model → Validate output (Zod)
    → Classify issues by severity → Compute quality score
    → Return structured AnalysisResult
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A GitHub account (for connecting repositories)
- API keys: Google Gemini, OpenRouter (free tiers available)
- Firebase project (free tier is sufficient)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ASTRA.git
cd ASTRA
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm install
```

### 3. Configure Environment Variables

**Frontend** — create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

**Backend** — create `backend/.env`:

```env
OPENROUTER_API_KEY=
GEMINI_API_KEY=
PORT=3000
NODE_ENV=development
```

### 4. Start Development Servers

```bash
# Terminal 1 — Backend
npm run start:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

Frontend runs at `http://localhost:5173`
Backend runs at `http://localhost:3000`

---

## Deployment

### Frontend → Vercel

```bash
# Option A: Vercel CLI
npx vercel --prod

# Option B: GitHub integration
# 1. Import repository at vercel.com/new
# 2. Set root directory to /frontend
# 3. Add all VITE_* environment variables
# 4. Deploy
```

### Backend → Railway

```bash
# Option A: Railway CLI
railway up

# Option B: GitHub integration
# 1. New project → Deploy from GitHub
# 2. Select repository → /backend directory
# 3. Add environment variables (OPENROUTER_API_KEY, GEMINI_API_KEY, PORT, NODE_ENV)
# 4. Railway generates a domain automatically
# 5. Copy domain → set as VITE_API_URL in Vercel
```

---

## Project Structure

```
ASTRA/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # AppShell, Sidebar, Navigation
│   │   │   ├── pr/              # PRHeader, DiffViewer (Monaco), FileTree
│   │   │   ├── review/          # AIReviewPanel, IssueRow, SeverityBadge
│   │   │   ├── panels/          # AISummaryCard, QualityScoreCard, ASTRAChat
│   │   │   └── ui/              # Base components (shadcn-style)
│   │   ├── hooks/               # useAnalysis, useChat, useRepos
│   │   ├── lib/
│   │   │   ├── firebase.ts      # Firebase client config
│   │   │   └── api.ts           # Backend API client
│   │   ├── stores/              # Zustand state slices
│   │   └── types/               # TypeScript interfaces
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── analyze.ts       # POST /api/analyze
│   │   │   ├── chat.ts          # POST /api/chat
│   │   │   └── docs.ts          # POST /api/docs/generate
│   │   ├── lib/
│   │   │   ├── ai/
│   │   │   │   ├── client.ts    # AI provider setup + fallback logic
│   │   │   │   └── prompts.ts   # System prompts
│   │   │   ├── github/
│   │   │   │   └── diff.ts      # Diff fetching + parsing
│   │   │   └── scoring.ts       # Quality score computation
│   │   └── index.ts             # Express app entry point
│   └── tsconfig.json
│
└── docs/
    └── ui-reference/
        └── ASTRA-UI-Reference.png
```

---

## Supported AI Models

| Provider | Model ID | Context Window | Best For |
|----------|----------|---------------|----------|
| Google | `gemini-2.0-flash-001` | 1,000,000 tokens | Full PR analysis |
| OpenRouter | `deepseek/deepseek-chat` | 128,000 tokens | Complex logic review |
| OpenRouter | `qwen/qwen-2.5-coder` | 32,000 tokens | Code-specific tasks |

The system selects the primary model (Gemini) for all analyses. If the primary provider returns an error or exceeds the 15-second timeout, the request automatically retries on the next provider in the fallback chain. The fallback is transparent — the user sees their analysis complete, not an error.

---

## Roadmap

The following features are planned for future releases:

- **GitHub App Integration** — auto-analyze PRs on open, post review comments directly to GitHub
- **PR Auto-Commenting** — write ASTRA's findings as inline GitHub review comments
- **AI Documentation Generation** — expanded docs pipeline with module architecture summaries
- **Team Collaboration** — shared repositories, team quality dashboards, reviewer assignments
- **Codebase Memory** — persistent context across PRs, evolving understanding of your codebase patterns
- **CI/CD Integration** — fail builds on critical security findings, enforce quality score thresholds
- **Repository Health Reports** — weekly codebase quality trends, technical debt velocity tracking

---

## Design Philosophy

ASTRA is designed for the kind of developer who has strong opinions about their tools.

The interface is dense and information-rich — not because we couldn't simplify it, but because professional developers want data, not training wheels. Every panel earns its place. Every pixel is intentional.

Visually: matte-black surfaces, thin borders, subtle purple accents. No gradients for decoration. No rounded cards that look like they belong in a consumer app. The aesthetic references VSCode, Linear, and Raycast — tools that feel serious because they are serious.

Technically: streaming AI responses, Monaco-quality diff rendering, sub-second interactions. The goal is to make AI review feel as fast as human skimming — not as slow as waiting for a report.

---

## Contributing

```bash
# Fork the repository
git checkout -b feature/your-feature-name

# Make your changes
# Ensure TypeScript compiles: npm run type-check
# Ensure lint passes: npm run lint

git commit -m "feat(review): add issue deduplication for large PRs"
git push origin feature/your-feature-name
# Open a pull request
```

Commit format: `type(scope): description`
Types: `feat` `fix` `perf` `refactor` `test` `docs` `chore`

---

## Author

Built by **Abhishek Gupta**

If ASTRA saves you time on code reviews, a GitHub star goes a long way.

---

<div align="center">

<br/>

*Stop waiting for reviewers. Start shipping better code.*

<br/>

**[⭐ Star on GitHub](https://github.com/YOUR_USERNAME/ASTRA)** · **[🚀 Live Demo](https://astra.vercel.app)** · **[📖 Documentation](https://docs.astra.dev)**

<br/>

</div>
