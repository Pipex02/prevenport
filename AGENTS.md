# Repository Guidelines

This repo tracks the Prevenport frontend described in the PRD (last updated 2025-09-16). Monorepo targets **Vite + Tailwind** builds, **Spanish UI**, and **deterministic telemetry mocks** for demos.

## Project Structure & Module Organization
- `apps/home/`: marketing site for **prevenport.dev**; static assets in `apps/home/public/`. Copy in **Spanish**.
- `apps/home/netlify.toml`: build command & SPA redirect for the home deployment.
- `apps/app/`: dashboard SPA for **app.prevenport.dev**.
  - React code under `src/features/{dashboard,vehicles,devices}/`.
  - Shared hooks/libs in `src/lib/` (e.g., `mockTelemetry.ts`, future Supabase adapters).
- `apps/app/netlify.toml`: mirrors home config but targets the dashboard build.
- `packages/ui/`: shared Tailwind-friendly components; export via barrel files.
- Docs live at root (`Project Requirements Document...`, `AGENTS.md`, `chatgpt-recomendations.md`).

## Build, Dev, and Workspace Commands
> Requires Node 20+ and pnpm. Prefer Corepack so Netlify/CI pick up the same version.

```bash
corepack enable && corepack prepare pnpm@9.6.0 --activate
pnpm install
# dev servers (filter selector goes before the command)
pnpm --filter @prevenport/home dev
pnpm --filter @prevenport/app dev
# build all workspaces
pnpm -r build
# lint / test when configs land
pnpm lint
pnpm test
```

* `packageManager` is pinned in root `package.json`; keep it updated when bumping pnpm.
* Each app’s Vite build writes to `dist/`; Netlify sites should use Base directory `apps/home` or `apps/app`, Build command `pnpm run build`, Publish directory `dist`. ([Monorepos | Netlify Docs][1])

## Netlify Deployment Checklist
- Root `netlify.toml` was removed on purpose; config lives beside each app.
- Ensure `apps/*/netlify.toml` stays in sync (build command `pnpm run build`, SPA redirect `/* /index.html 200`). ([Redirects | Netlify Docs][2])
- In Netlify UI create **two sites** pointing to this repo:
  1. Base dir `apps/home` → hostname `www.prevenport.dev` (primary).
  2. Base dir `apps/app` → hostname `app.prevenport.dev`.
- Name.com DNS (external):
  - `www` CNAME → `{home-site}.netlify.app`
  - `app` CNAME → `{app-site}.netlify.app`
  - Apex `prevenport.dev` → ANAME `apex-loadbalancer.netlify.com` (or A `75.2.60.5`).
- Add site-specific env vars (Supabase keys later) via Site settings → Build & deploy → Environment.

## Coding Style & Naming Conventions
- TypeScript everywhere; functional React components.
- 2-space indentation; single quotes; trailing commas where valid.
- Files: components `PascalCase.tsx`; hooks/utils `camelCase.ts`.
- Tailwind classes can live inline; extract reusable UI into `packages/ui` when duplication appears.
- Format via Prettier + ESLint. Run `pnpm lint --fix` before pushing once config is wired.

## Charting & Telemetry
- Chart.js setup is manual: import controllers/elements/scales explicitly (`Chart.register(...)`), include `chartjs-adapter-date-fns`, and register `chartjs-plugin-zoom`. ([Chart.js Time Axis][3])
- Deterministic data via `generateTelemetry(seed, hours)` in `apps/app/src/lib/mockTelemetry.ts`; keep seeds centralized for predictable demos.
- Auto-refresh interval = 5s when data source is `Mock`; allow toggle scaffolding for Supabase (disabled in v1).

## Testing (Roadmap)
- Preferred stack: Vitest + Testing Library + MSW. Co-locate tests as `*.test.ts(x)` next to source.
- Coverage focus on `src/features/dashboard` before handing off real telemetry.

## Git Hygiene
- Use Conventional Commits (`feat:`, `fix:`, `chore:`). Reference PRD section in body/PR when applicable.
- Rebase before raising PRs; keep branches small (`feature/mock-telemetry`, etc.).
- PRs include: summary, testing notes, screenshots/GIFs for UI work, deploy checklist (Netlify site & DNS status).

## Product UX Notes (v1)
- Spanish UI copy across landing and app.
- Login button opens "Próximamente" modal until Supabase auth lands.
- Vehicles view: Reach Stacker & Tractocamión cards with status badge, alert count, mock "time since last fault".
- Devices view: two RPi cards with status and mock "Conectar" action.

[1]: https://docs.netlify.com/build/configure-builds/monorepos/
[2]: https://docs.netlify.com/manage/routing/redirects/overview/
[3]: https://www.chartjs.org/docs/latest/axes/cartesian/time.html
