# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SoulTest is a quiz operations platform + digital access/verification system targeting content-commerce channels like Xiaohongshu. It has two core flows:

- **User flow**: browse quizzes → enter verification code → take test → view result → share
- **Admin flow**: manage quizzes, products, code batches, and publish status

## Commands

```bash
# First-time setup (or after schema changes)
pnpm db:migrate:local
pnpm db:seed:local

# Start both frontend + API together
pnpm dev

# Start individually
pnpm dev:web    # Vite frontend only
pnpm dev:api    # Cloudflare Pages Functions only (port 8788)

# Build / lint
pnpm build      # tsc + vite build
pnpm lint       # ESLint

# Cloudflare types regeneration
pnpm cf:typegen
```

Local test codes: `ST-DEMO-ALPHA`, `ST-PACK-618`, `SOUL-LOVE-0313`, `ST-PROMO-OPEN`

## Architecture

### Frontend (`src/`)

React 19 + Vite 8 + TypeScript + Tailwind CSS 4 + React Router v7 + shadcn/ui.

- `src/app/router.tsx` — route definitions (public layout + admin layout)
- `src/app/layouts/` — `PublicLayout` and `AdminLayout` wrappers
- `src/pages/` — one file per route: `HomePage`, `QuizDetailPage`, `QuizTestPage`, `QuizResultPage`, `AdminDashboardPage`
- `src/features/quizzes/` — all quiz domain logic:
  - `types.ts` — shared TypeScript interfaces (also mirrored in `functions/_lib/types.ts`)
  - `engine.ts` — scoring engine: `evaluateQuiz()`, `calculateScoreBreakdown()`, `resolveQuizStrategies()`
  - `api.ts` — fetch wrappers for all API endpoints
  - `session.ts` — access token / session management
  - `result-template-registry.ts` + `result-templates.tsx` — pluggable result display components
  - `custom-pages.ts` — registry for quiz-specific custom renderers
- `src/components/ui/` — mix of shadcn/ui primitives and Aceternity UI display components
- `src/components/layout/` — `SiteHeader`, `SiteFooter`

### Backend (`functions/`)

Cloudflare Pages Functions (file-based routing under `functions/api/`).

- `functions/_lib/types.ts` — shared types including `CloudflareEnv` (D1, KV, R2 bindings)
- `functions/_lib/repository.ts` — D1 query layer
- `functions/_lib/scoring.ts` — server-side scoring (mirrors frontend engine)
- `functions/_lib/mock-data.ts` — stub data when `API_STUB_MODE=mock`
- `functions/_lib/http.ts` — response helpers

API routes map directly to file paths: `functions/api/quizzes/[slug]/runtime.ts` → `GET /api/quizzes/:slug/runtime`.

### Database (`db/`)

Cloudflare D1 (SQLite). Migrations in `db/migrations/`, seed in `db/seeds/local.sql`. Wrangler config in `wrangler.jsonc`.

## Key Design Principles

- **D1 is the only source of truth** — KV is cache/short-lived tokens only; R2 is assets/published artifacts only
- **Verification codes are not immediately consumed** — expiration-based access is preferred over single-use destruction
- **Quiz config follows "generic core + custom extension"** — simple quizzes use the generic model; complex ones can register custom renderers/scoring via `custom-pages.ts` and `result-template-registry.ts`
- **UI layering**: shadcn/ui for stable interaction primitives (forms, tables, admin); Aceternity UI selectively for marketing/display sections (landing, result pages)

## Scoring Models

The engine (`src/features/quizzes/engine.ts`) supports six scoring models configured via `QuizRuntimeConfig.runtime.scoringModel`:

| Key | Behavior |
|-----|----------|
| `dimension` | Highest dimension score wins (default) |
| `accumulate` | Sum all option scores, map to result |
| `range` | Total score falls within a defined range |
| `branch` | Answer pattern matching (decision tree) |
| `radar` | Multi-dimension scores for radar chart display |
| `oejts` | MBTI-style axis scoring (IE/SN/FT/JP) |

## Path Aliases

`@/` maps to `src/` (configured in `tsconfig.app.json` and `vite.config.mjs`).
