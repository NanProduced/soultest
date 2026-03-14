# SoulTest - Project Context

SoulTest is a comprehensive **Quiz Operation Platform + Digital Rights Delivery System** designed for content channels like Rednote (小红书). It supports multi-quiz management, access code verification, quiz execution, result scoring, and sharing.

## 🏗 Architecture & Tech Stack

### Frontend
- **Framework**: React 19 (Vite 8, TypeScript)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Icons**: Lucide React
- **Directory**: `src/`
  - `src/features/`: Domain-specific logic, types, and API calls (e.g., `quizzes`).
  - `src/app/`: Core layouts and routing configuration.
  - `src/pages/`: Page-level components.
  - `src/components/`: Reusable UI components (including `shadcn/ui` in `src/components/ui`).

### Backend (Cloudflare Native)
- **Platform**: Cloudflare Pages Functions
- **Database**: Cloudflare D1 (SQL database as the source of truth)
- **Cache/Session**: Cloudflare KV (Used for short-lived access tokens and session data)
- **Storage**: Cloudflare R2 (For assets like quiz covers and generated share images)
- **Directory**: `functions/`
  - `functions/api/`: API endpoint implementations.
  - `functions/_lib/`: Shared library including the data repository, scoring engine, and types.
  - `functions/_lib/repository.ts`: Data access layer with support for both D1 and Mock data.

## 🛠 Building and Running

### Prerequisites
- `pnpm`
- Cloudflare `wrangler` (installed via devDependencies)

### Key Commands
- **Install dependencies**: `pnpm install`
- **Database Setup (Local)**:
  - Apply migrations: `pnpm db:migrate:local`
  - Seed initial data: `pnpm db:seed:local`
- **Development**:
  - Full stack (Vite + Wrangler): `pnpm dev`
  - Frontend only: `pnpm dev:web`
  - API only: `pnpm dev:api`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`

## 📋 Development Conventions

### Data Source & Mocking
- **Mock Mode**: The system supports an `API_STUB_MODE=mock` environment variable. When enabled, the `repository.ts` falls back to `mock-data.ts` if D1 operations fail or if specifically configured.
- **D1 First**: For production-ready features, D1 is the primary source of truth.

### API & Routing
- Frontend API calls should be centralized in `src/features/[feature]/api.ts`.
- Backend functions follow the Cloudflare Pages file-based routing in the `functions/` directory.

### UI/UX
- Use `shadcn/ui` for standard UI components.
- Custom aesthetic components should be placed in `src/components/`.
- Styling follows Tailwind CSS 4 conventions.

## 🔑 Key Entities
- **Quiz**: A set of questions, scoring logic, and result templates.
- **Product**: A commercial entity that can contain one or more Quizzes.
- **Code Batch**: A group of access codes generated for a specific Product.
- **Access Token**: A session token (stored in KV) generated after verifying a valid Access Code.

## 🧪 Testing & Verification
- Use `pnpm dev` to test the integrated flow.
- Check `functions/api/health.ts` (`GET /api/health`) to verify local D1/KV/R2 connectivity.
- Test access codes provided in `README.md` (e.g., `ST-DEMO-ALPHA`) for local development.
