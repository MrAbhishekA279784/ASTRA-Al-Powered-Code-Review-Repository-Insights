# ASTRA - AI-Powered Code Review Platform

## Build & Verify
```powershell
npx tsc --noEmit                      # TypeScript check (0 errors expected)
npm run build                          # Vite client + esbuild server CJS
```

## Architecture
- **Client:** React 19 + TypeScript + Vite + Tailwind CSS + framer-motion
- **Server:** Express (`server.ts`) → bundled to `dist/server.cjs`
- **Auth:** Firebase Auth (Google, GitHub, Email/password)
- **AI:** `src/lib/ai/` — OpenRouter multi-model system (`models.ts`, `provider.ts`, `router.ts`, `fallback.ts`, `prompts.ts`). Fallback chain: `deepseek/deepseek-chat` → `qwen/qwen-2.5-coder-32b-instruct` → `google/gemini-2.0-flash-001`, 1 retry per provider, 30s timeout
- **Routing:** No React Router — state-based routing via `AstraContext` (`currentView: ViewType`)
- **Build output:** `dist/` (client) + `dist/server.cjs` (server)

## Key Files
- `src/App.tsx` — Root: LandingPage → AuthScreen → Dashboard + all views + header/profile
- `src/context/AstraContext.tsx` — Global state: navigation, PR data, chat, toast, review
- `src/providers/auth-provider.tsx` — Firebase auth context (Google, GitHub, Email)
- `src/components/Sidebar.tsx` — Desktop nav (8 items) + quick actions + profile dropdown
- `src/components/ProfilePanel.tsx` — Profile dropdown with user info, stats, settings, logout
- `src/components/LandingPage.tsx` — Marketing page (hero, features, integrations, CTA, footer)
- `src/components/Dashboard.tsx` — Authenticated PR input dashboard
- `src/components/views/` — `RepositoriesView`, `AIReviewView`, `DocsView`, `ReportsView`, `ChangelogView`, `SettingsView`
- `src/components/mobile/` — Mobile views: `MobileLayout`, `MobileBottomNav`, `MobileHome`, `MobileActivity`, `MobileProfile`, `MobilePRView`, `MobileRepos`, `MobileDocs`, `MobileChat`, `MobileReview`
- `src/lib/firebase.ts` — Firebase init
- `src/lib/ai/` — AI module: `models.ts` (model config), `provider.ts` (OpenRouter fetch client), `router.ts` (request routing), `fallback.ts` (provider fallback chain), `prompts.ts` (prompt templates)
- `server.ts` — Express server; imports from `src/lib/ai/router.ts`

## Conventions
- UI font: Inter (sans) + Playfair Display (serif headings on landing)
- Colors: `#FDFCFB` (bg), `#1C1C1E` (text), `#B89C85`/`#A68A73` (accent), `#F0EFEB`/`#FAF9F6`/`#F5F4F1` (borders/surfaces)
- Styling: Tailwind CSS utility classes (NO CSS modules or styled-components)
- Animation: `motion` from `framer-motion` re-export
- Icons: `lucide-react`
- Charts: `recharts`
- No React Router — use `navigate(viewName)` from `useAstra()`
- Toast: `showToast(message, type)` from `useAstra()` — types: `'success' | 'error' | 'info'`
- Auth: `useAuth()` from `src/providers/auth-provider.tsx`
- `currentView` values: `'landing' | 'dashboard' | 'pr' | 'repos' | 'review' | 'docs' | 'reports' | 'changelog' | 'settings' | 'profile' | 'mobile-home' | 'mobile-activity' | 'mobile-profile' | 'mobile-pr' | 'mobile-repos' | 'mobile-docs' | 'mobile-chat' | 'mobile-review'`

## Prerequisites
- `OPENROUTER_API_KEY` in `.env.local` for server-side AI calls
- Firebase API key in `src/lib/firebase.ts` (restrict to specific domains in Firebase Console)
