# Repository Guidelines

This repo tracks the Prevenport frontend described in the PRD (last updated 2025‑09‑16). Monorepo targets **Vite + Tailwind** builds, **Spanish UI**, and **deterministic telemetry mocks** for demos.

## Project Structure & Module Organization
- `apps/home/`: marketing site for **prevenport.dev**; static assets in `apps/home/public/`. Copy in **Spanish**.
- `apps/app/`: dashboard SPA for **app.prevenport.dev**.
  - React code under `src/features/{dashboard,vehicles,devices}/`.
  - Shared hooks/libs in `src/lib/` (e.g., `MockTelemetryProvider.tsx`, `useMockTelemetry.ts`).
- `apps/app/public/_redirects`: Netlify SPA redirects (`/* /index.html 200`). See Netlify redirects docs. 
- `packages/ui/` (optional, later): shared Tailwind components; export via barrel files.
- Docs live at root (`PRD.md`, `AGENTS.md`).

## Build, Dev, and Workspace Commands
> Requires Node 20+ and pnpm (via Corepack).

```bash
corepack enable && corepack prepare pnpm@10 --activate && pnpm install
# dev servers (note: filter flag before the command)
pnpm --filter ./apps/app dev
pnpm --filter ./apps/home dev
# build all workspaces
pnpm -r build
# lint (once config lands)
pnpm lint
```

* **pnpm filtering** syntax reference: `pnpm --filter <selector> <command>`. Use a relative path selector for app folders or the package name once set. ([pnpm.io][1])
* **Monorepo on Netlify**: configure each site with its **Base directory** (`apps/home`, `apps/app`) in Site settings → Build settings. ([Netlify Docs][2])
* **SPA redirects**: `_redirects` with `/* /index.html 200`. ([Netlify Docs][6])

## Coding Style & Naming Conventions

* TypeScript everywhere; functional React components.
* 2‑space indentation; single quotes; trailing commas where valid.
* Files: Components `PascalCase.tsx`; hooks/utils `camelCase.ts`.
* Tailwind classes can live in JSX; extract repeated UI into `packages/ui/` when it adds value.
* Prettier + ESLint; `pnpm lint --fix` before pushing.

## Charting Conventions (Chart.js via react-chartjs-2)

* **Time axis** requires a date adapter (we use `chartjs-adapter-date-fns`). ([chartjs.org][3])
* **Zoom/Pan** via `chartjs-plugin-zoom` (mouse wheel / pinch). Register the plugin. ([chartjs.org][7])
* **Tree‑shaking**: avoid `import 'chart.js/auto'` in production; import and `Chart.register(...)` only what you use (controllers, elements, scales, plugins). ([chartjs.org][8])

*Minimal example for line + scatter with time scale & zoom:*

```ts
// charts/setup.ts
import {
  Chart, LineController, LineElement, PointElement,
  ScatterController, CategoryScale, LinearScale, TimeScale, Tooltip, Legend
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-date-fns'

Chart.register(
  LineController, LineElement, PointElement,
  ScatterController, CategoryScale, LinearScale, TimeScale,
  Tooltip, Legend, zoomPlugin
)
// In chart options: options.plugins.zoom = { zoom: { wheel: { enabled:true } }, pan: { enabled:true } }
```

## Mock Data & Environment Notes

* **Deterministic telemetry**: use `MockTelemetryProvider` signatures; centralize seeds to keep dashboards reproducible. (Use `seedrandom` for PRNG; `dayjs` for time windows.) ([npm][9])
* **Data‑source toggle**: `Mock` (default) | `Supabase` (disabled in v1).
* **Env vars**: set site variables in Netlify → Project configuration → **Environment variables**. Don’t commit secrets; keep `.env.example` only. Netlify doesn’t read local `.env` during builds unless you import variables. ([Netlify Docs][5])

## Testing (deferred to v2+)

* Tooling suggestions (not required in v1): **Vitest** + **React Testing Library**; **MSW** for API mocks. Keep seeds stable in tests that assert chart rendering. ([Testing Library][10])

## Commit & Pull Request Guidelines

* **Conventional Commits** (`feat:`, `fix:`, `chore:`) for clean history and changelog automation. Reference PRD section in PRs. ([Conventional Commits][11])
* Small, reviewable branches (`feature/mock-telemetry`, etc.); rebase before PR.
* PRs include summary, testing notes (if any), screenshots/GIFs for UI updates, and deploy checklist (Netlify context & DNS).

## Product UX Notes (v1)

* **Language**: Spanish UI.
* **Login**: keep a visible button that opens a **“Próximamente / Coming soon”** modal.
* **Vehicles view**: 2 cards (Reach Stacker, Tractocamión) with state badge (Online/Offline/Delay), active alerts count, and time since last fault (mock).
* **Devices view**: 2 RPi cards with status and **Conectar** (mock) action.
