# Repository Guidelines

This repo tracks the Prevenport frontend described in the PRD (last updated 2025-09-16). Everything below keeps the monorepo ready for Vite + Tailwind builds and deterministic telemetry demos.

## Project Structure & Module Organization
- `apps/home/`: marketing SPA for prevenport.dev; keep assets in `apps/home/public/` and shared copy in Spanish.
- `apps/app/`: dashboard SPA for app.prevenport.dev. Group React code under `src/features/{dashboard,vehicles,devices}/` and shared hooks in `src/lib/` (e.g., `MockTelemetryProvider.tsx`).
- `apps/app/public/_redirects`: maintain Netlify SPA redirects.
- `packages/ui/` (optional later): shared Tailwind components; export via barrel files.
- Docs live at root (`PRD`, `AGENTS.md`); avoid scattering markdown elsewhere.

## Build, Test, and Development Commands
- `corepack enable && pnpm install`: set up workspace dependencies.
- `pnpm dev --filter apps/app`: run the dashboard locally with Vite.
- `pnpm dev --filter apps/home`: serve the marketing site.
- `pnpm build`: produce production bundles for every workspace.
- `pnpm test --filter apps/app`: execute unit and component specs.
Always run `pnpm lint` before pushing once the config lands.

## Coding Style & Naming Conventions
- TypeScript everywhere; prefer functional React components.
- 2-space indentation, single quotes, trailing commas where valid.
- Component files follow `PascalCase.tsx`; hooks/utilities use `camelCase.ts`.
- Tailwind classes stay in JSX; extract repeated patterns into `packages/ui` components.
- Format with Prettier + ESLint (`pnpm lint --fix`) and let CI fail on style drift.

## Testing Guidelines
- Use Vitest + Testing Library for UI, Mock Service Worker for API placeholders.
- Co-locate tests as `*.test.ts(x)` beside the source.
- Keep deterministic seeds in telemetry tests (`seedrandom`) to match mock dashboards.
- Target >=80% critical-path coverage on `src/features/dashboard` before feature handoff.
- Smoke-test charts manually with `pnpm dev --filter apps/app` after touching telemetry logic.

## Commit & Pull Request Guidelines
- Adopt Conventional Commits (`feat:`, `fix:`, `chore:`) to keep changelog automation simple.
- Reference the PRD section you touched in the commit body or PR description.
- PRs need: summary, testing notes, screenshots/GIFs for UI updates, and deployment checklist (DNS, Netlify context).
- Rebase before opening a PR; prefer small, reviewable branches (`feature/mock-telemetry` etc.).

## Mock Data & Environment Notes
- Mock telemetry must remain deterministic per vehicle: stick to `MockTelemetryProvider` signatures and update seeds in one place.
- Document any Supabase toggle experiments in `apps/app/README.md` until the backend is live.
- Netlify env vars stay in the dashboard of each site; never commit `.env` with secrets. Use `.env.example` for local defaults.
