Below is the **Project Requirements Document (PRD)** for the **prevenport** frontend. It reflects your clarified answers and sets up v1 with a **Spanish UI**, **no auth yet (login placeholder)**, **mock data generated on the client**, and **charts built with `react-chartjs-2` (Chart.js)** including **zoom/pan**. It also documents **Netlify + Name.com external DNS** and a future path to Supabase.

---

# Prevenport — Frontend PRD (v1)

**Doc owner:** You
**Repository:** `prevenport`
**Last updated:** 2025‑09‑16
**Status:** Draft → Ready for implementation

---

## 1) Purpose & Goals

Build and deploy a **clean, professional SPA** to showcase the project, with:

* **Home site** (`prevenport.dev`) and **App** (`app.prevenport.dev`).
* Spanish UI (texts, labels).
* **Dashboard per vehicle** (no cross‑vehicle compare in v1).
* **Devices & Vehicles** overview pages with concise status/alerts.
* **Charts** using `react-chartjs-2` (Chart.js) + **time scale** and **zoom/pan**. ([React Chart.js 2][1])
* **Mock (deterministic) data** generated in the browser (every 5 s).
* **Login button present** but **no authentication** yet (modal “Coming soon”).

**Non‑goals (v1):** authentication flows; backend reads/writes; sharing real data; performance budgets and tests (to be added in later versions).

---

## 2) Users & Use Cases

* **Advisor / stakeholders**: quick demo of UX, charts and information hierarchy.
* **You**: iterate weekly, swap mock → real data later without changing views.

---

## 3) Information Architecture & Navigation

**Sites**

* **Home** (`prevenport.dev`): overview, value proposition, CTA → “Abrir app”.
* **SPA** (`app.prevenport.dev`): tabs **Dashboard**, **Vehicles**, **Devices**, **About**, **Login** (modal only).

**Language:** Spanish for all UI strings in v1.

---

## 4) Functional Requirements

### 4.1 Home (public marketing page)

* Hero title/subtitle, 1–2 párrafos de contexto del proyecto.
* CTA: **“Abrir app”** → `app.prevenport.dev`.
* Footer con enlaces a repositorio y contacto.

### 4.2 App — Global

* **Navbar** (Dashboard, Vehicles, Devices, About, Login).
* **Theme:** Tailwind (palette **zinc/slate** + **emerald** accent; dark mode optional).
* **Data Source Toggle** (header): `Mock` (default) | `Supabase` (disabled/message for v1).
* **Spanish labels** throughout.

### 4.3 Dashboard (per‑vehicle)

* Selector de vehículo (Reach Stacker, Tractocamión).
* **Time‑series charts (líneas)**, resolución 5 min, **rango por defecto 24 h**, selector 1 h / 24 h / 7 d.
* **Métricas** (series separadas):

  * **RPM (rev/min)**
  * **Velocidad (km/h)**
  * **Temperatura del motor (°C)**
  * **Consumo de combustible (L/100 km)**
* **Scatter charts**:

  * **Carga (%) vs Consumo (L/100 km)**
  * **Carga (%) vs RPM**
* **Interacción**: **zoom/pan** y tooltips. Implementado con Chart.js + `chartjs-plugin-zoom`. ([Chart.js][2])
* **Auto‑refresh**: añade puntos nuevos **cada 5 s** desde el emulador (sin streaming plugin; append & `chart.update()`).
* **Vaciar/llenar**: botón “Restablecer zoom”.

> **Charting stack**
>
> * **React wrapper**: `react-chartjs-2`. ([React Chart.js 2][1])
> * **Chart engine**: Chart.js **time scale** (requires date adapter) + **scatter/line** samples. ([Chart.js][3])
> * **Zoom/Pan**: `chartjs-plugin-zoom`. ([Chart.js][2])
> * **Date adapter**: `chartjs-adapter-date-fns` (recommended for time scale). ([GitHub][4])

### 4.4 Vehicles

* Tarjetas para **Reach Stacker** y **Tractocamión**.
  Campos: nombre, estado (Online/Offline/Delay), **alertas activas (número y breve texto)**, **tiempo desde el último fallo** (derivado de mocks), y acceso rápido al **Dashboard** de ese vehículo.

### 4.5 Devices

* Dos **edge devices** (RPi): nombre, id, última señal, estado (Online/Offline/Delay), versión mock de “**Conectar**” (cambia estado local a *Online* y muestra toast “Conexión establecida (simulada)”).
* Card de detalle con “datos” básicos (CPU temp sim., uptime sim.).

### 4.6 About

* Breve descripción del proyecto, tecnologías y roadmap.

### 4.7 Login (placeholder)

* Botón visible; al hacer clic abre modal **“Coming soon”**.
* No recoge credenciales ni toca Supabase en v1.

---

## 5) Data Model (frontend v1)

> **Sin persistencia real en v1**. Todo mockeado en el cliente.

**Entities (TypeScript, guía):**

```ts
type VehicleKind = 'reach-stacker' | 'tractocamion';

interface Vehicle {
  id: string; name: string; kind: VehicleKind;
  status: 'online' | 'offline' | 'delay';
  activeAlerts: { id: string; title: string; severity: 'low'|'med'|'high' }[];
  lastFaultAt: string; // ISO
}

interface Device {
  id: string; name: string; vehicleId: string;
  status: 'online' | 'offline' | 'delay';
  lastSeenAt: string; // ISO
}

type MetricKey = 'rpm' | 'speed_kmh' | 'engine_temp_c' | 'fuel_l_per_100km' | 'load_pct';

interface TelemetryPoint { t: string; v: number; metric: MetricKey; deviceId: string; }
```

**Time resolution:** 5 min buckets en series de 24 h; nueva muestra cada **5 s** (simulación interpolada).
**Scatter X/Y:** `load_pct` en X; `fuel_l_per_100km` o `rpm` en Y (resample de la última hora para densidad).

---

## 6) Mock Data Component (must‑have)

**Name:** `MockTelemetryProvider` + hook `useMockTelemetry()`

**Goals**

* Generar **series determinísticas** por `vehicleId`/`deviceId`/`metric` con una **semilla fija**.
* **Append** de puntos **cada 5 s**; API para pausar/reanudar.
* Exponer utilidades para **series históricas** (24 h) y **scatter** (últ. 1 h).

**Internals**

* **PRNG**: `seedrandom` (deterministic). ([npm][5])
* **Fechas**: `dayjs` (+ UTC/relativeTime si hiciera falta). ([Day.js][6])

**Public API (frontend only)**

```ts
getSeries(opts: {
  deviceId: string; metric: MetricKey;
  start: string; end: string; everyMs: number; seed: string;
}): TelemetryPoint[]

streamSeries(opts: {
  deviceId: string; metric: MetricKey;
  everyMs: number; seed: string; onPoint: (p: TelemetryPoint) => void;
}): () => void // unsubscribe
```

**Generation model (suggested):**

* `rpm`: base 1200–1900 + variación suave (seno) + jitter leve.
* `speed_kmh`: trayecto con pausas → ruido bajo.
* `engine_temp_c`: ascenso a régimen y estabilización (60–95 °C).
* `fuel_l_per_100km`: función de `load_pct` y `speed_kmh` con ruido bajo.
* `load_pct`: 20–90 % por tramos.

**Acceptance (mock):**

* Misma semilla ⇒ **misma serie**.
* `streamSeries` entrega un punto cada **≈5 s** y no bloquea la UI.

---

## 7) UI/UX Specifications

* **Typography & Colors:** Tailwind CSS; escala **slate/zinc** para base; acento **emerald**; dark mode opcional (toggle en header).
* **Cards/tiles**: usan badges de estado (Online/Offline/Delay).
* **Charts**:

  * Line charts (time scale) para las 4 métricas; **zoom/pan** con rueda / pinch. ([Chart.js][2])
  * Scatter para **Carga vs Consumo** y **Carga vs RPM**. ([Chart.js][7])
  * Time scale requiere **date adapter** (usaremos `chartjs-adapter-date-fns`). ([Chart.js][3])

**Copy (Spanish)**

* Botón CTA Home: “**Abrir app**”.
* Login modal: “**Próximamente**”.

---

## 8) Technical Architecture

### 8.1 Frontend stack

* **Build tool:** **Vite** (React). ([vitejs][8])
* **UI:** **Tailwind CSS** **v4** con **plugin oficial para Vite** (`@tailwindcss/vite`). ([Tailwind CSS][9])
* **Charts:** **react-chartjs-2** + **Chart.js** + `chartjs-plugin-zoom` + `chartjs-adapter-date-fns`. ([React Chart.js 2][1])
* **Time utilities:** **Day.js**. ([Day.js][6])
* **Deterministic RNG:** **seedrandom**. ([npm][5])

> (Optional for later) For continuous feeds, consider `chartjs-plugin-streaming`; v1 will **not** use it. ([nagix][10])

### 8.2 Repository layout (single repo, two sites)

```
prevenport/
  apps/
    home/      # marketing site (prevenport.dev)
    app/       # SPA (app.prevenport.dev)
  packages/
    ui/        # (optional) shared UI
  README.md
```

**Netlify** supports **monorepos** by setting **Base directory** per site (one site per subfolder). ([Netlify Docs][11])

### 8.3 Deployment & Domain (Netlify + Name.com External DNS)

* **SPA routing:** add `_redirects` with `/* /index.html 200` in `apps/app/public`. ([Netlify Support Forums][12])
* **Custom domains (external DNS):**

  * `www.prevenport.dev` → **CNAME** a tu `*.netlify.app`.
  * `app.prevenport.dev` → **CNAME** a su `*.netlify.app`.
  * **Apex** `prevenport.dev`: **ANAME/ALIAS** (o flattened CNAME/A record) según proveedor. **Name.com** soporta **ANAME** (Alias). ([Netlify Docs][13])
* **HTTPS:** `.dev` está **HSTS preloaded** (HTTPS obligatorio). Asegura certificados válidos en Netlify; HTTP no cargará. ([HSTS Preload][14])

---

## 9) Non‑Functional Requirements (v1)

* **Security & privacy:** sin claves ni datos reales en el cliente; no exponer endpoints.
* **Accessibility:** color contrast ≥ AA donde aplique (a validar en v2).
* **Performance:** budgets formales (LCP, bundle) **fuera de alcance** en v1; optimizar tree‑shaking de Chart.js siguiendo guía. ([Chart.js][15])
* **Browser support:** evergreen (Chrome, Edge, Safari, Firefox) actuales.

---

## 10) Future Integration (v2+)

* **Supabase** para Auth + datos reales (RLS en tablas, vistas privadas). ([Supabase][16])
* **Auth UI** (React) e `@supabase/supabase-js`. ([Supabase][17])
* Conmutador **Mock|Supabase**: activar modo Supabase y desactivar el emulador.

---

## 11) Acceptance Criteria (v1)

1. **Home** visible en `prevenport.dev` con CTA a la app.
2. **SPA** en `app.prevenport.dev` con navegación funcional (Dashboard, Vehicles, Devices, About, Login).
3. **Dashboard**:

   * Selector de vehículo (2 opciones).
   * 4 **line charts** con **time scale** para la ventana por defecto de **24 h** (5 min resol.).
   * 2 **scatter charts** (Carga vs Consumo; Carga vs RPM).
   * **Zoom/pan** operativos (mouse wheel, touch pinch). ([Chart.js][2])
   * **Auto‑refresh**: nuevos puntos agregados **cada 5 s** cuando el toggle “Mock” esté activo.
4. **Vehicles**: cards de ambos vehículos con estado, #alertas, **tiempo desde último fallo** (mock).
5. **Devices**: cards de 2 RPi con estado y botón **Conectar** (mock) que actualiza estado y muestra toast.
6. **Login**: botón visible; abre modal “**Próximamente**”.
7. **Idioma**: toda la UI en Español.
8. **DNS/HTTPS**: `www` y `app` resuelven por **CNAME**; **apex** configurado con **ANAME/ALIAS** (Name.com). Certificados activos en Netlify; `.dev` servida por **HTTPS**. ([Netlify Docs][13])

---

## 12) Implementation Plan (high‑level)

**Sprint 1 (2–3 días)**

* Scaffold repos `apps/home` y `apps/app` (Vite React). ([vitejs][8])
* Tailwind v4 + plugin Vite. ([Tailwind CSS][9])
* Netlify: 2 sitios desde monorepo (base directories). ([Netlify Docs][11])
* DNS (Name.com external): CNAME `www`/`app`; ANAME/ALIAS apex. ([Netlify Docs][13])
* `_redirects` para SPA. ([Netlify Support Forums][12])

**Sprint 2 (2–3 días)**

* `MockTelemetryProvider` + `useMockTelemetry()` (dayjs + seedrandom). ([Day.js][6])
* Páginas **Vehicles** y **Devices** con tiles/badges (estados mock + “Conectar”).

**Sprint 3 (2–3 días)**

* Dashboard con 4 **line charts** (time scale) y 2 **scatter**; zoom/pan (`chartjs-plugin-zoom`); adapter date‑fns. ([Chart.js][2])
* “Data Source toggle” (Mock por defecto; Supabase deshabilitado con tooltip).

---

## 13) Risks & Mitigations

* **Drift de librerías (Tailwind v4 / Vite):** seguir guía oficial de Tailwind v4 + plugin Vite. ([Tailwind CSS][9])
* **Time scale sin adapter:** incluir `chartjs-adapter-date-fns` (requerido por Chart.js para ejes de tiempo). ([Chart.js][3])
* **HSTS en `.dev`**: si el certificado falla, el sitio **no cargará** (HTTPS obligatorio). Verificar verificación DNS y emisión en Netlify. ([HSTS Preload][14])

---

## 14) Deliverables

* **Repo `prevenport`** con:

  * `apps/home` (deploy → `prevenport.dev`).
  * `apps/app` (deploy → `app.prevenport.dev`).
  * `apps/app/src/lib/MockTelemetryProvider.tsx` + `useMockTelemetry.ts`.
  * Config de Tailwind + Vite; `_redirects` en `apps/app/public`.
* **Netlify**: 2 sitios enlazados al repo (CD activo).
* **Name.com**: CNAMEs (`www`, `app`) + **ANAME/ALIAS** en apex. ([Name.com][18])

---

### Appendix A — Key references

* **react-chartjs-2** (React wrapper for Chart.js). ([React Chart.js 2][1])
* **Chart.js** time scale & adapter; scatter/line docs. ([Chart.js][3])
* **Zoom/Pan** plugin. ([Chart.js][2])
* **Day.js** (date utilities). ([Day.js][6])
* **seedrandom** (deterministic PRNG). ([npm][5])
* **Netlify** external DNS & SPA redirects. ([Netlify Docs][13])
* **Name.com** ANAME/ALIAS. ([Name.com][18])
* **HSTS preload (.dev)**. ([HSTS Preload][14])

---

If you’d like, I can follow up with:

* A minimal **TypeScript interfaces file** for entities,
* A **stub implementation** for `MockTelemetryProvider` (deterministic sine + noise), and
* A **Netlify monorepo checklist** (build commands / publish directories) tailored to your repo.

[1]: https://react-chartjs-2.js.org/?utm_source=chatgpt.com "react-chartjs-2"
[2]: https://www.chartjs.org/chartjs-plugin-zoom/latest/guide/?utm_source=chatgpt.com "Getting Started | chartjs-plugin-zoom"
[3]: https://www.chartjs.org/docs/latest/axes/cartesian/time.html?utm_source=chatgpt.com "Time Cartesian Axis"
[4]: https://github.com/chartjs/chartjs-adapter-date-fns?utm_source=chatgpt.com "date-fns adapter for Chart.js"
[5]: https://www.npmjs.com/package/seedrandom?utm_source=chatgpt.com "seedrandom"
[6]: https://day.js.org/?utm_source=chatgpt.com "Day.js · 2kB JavaScript date utility library"
[7]: https://www.chartjs.org/docs/latest/charts/scatter.html?utm_source=chatgpt.com "Scatter Chart"
[8]: https://vite.dev/guide/?utm_source=chatgpt.com "Getting Started"
[9]: https://tailwindcss.com/blog/tailwindcss-v4?utm_source=chatgpt.com "Tailwind CSS v4.0"
[10]: https://nagix.github.io/chartjs-plugin-streaming/?utm_source=chatgpt.com "chartjs-plugin-streaming - nagix"
[11]: https://docs.netlify.com/build/configure-builds/monorepos/?utm_source=chatgpt.com "Monorepos | Netlify Docs"
[12]: https://answers.netlify.com/t/deploying-single-page-applications/14695?utm_source=chatgpt.com "Deploying single page applications"
[13]: https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/?utm_source=chatgpt.com "Configure external DNS for a custom domain"
[14]: https://hstspreload.org/?utm_source=chatgpt.com "HSTS Preload List Submission"
[15]: https://www.chartjs.org/docs/latest/getting-started/usage.html?utm_source=chatgpt.com "Step-by-step guide"
[16]: https://supabase.com/docs/guides/database/postgres/row-level-security?utm_source=chatgpt.com "Row Level Security | Supabase Docs"
[17]: https://supabase.com/docs/guides/auth/quickstarts/react?utm_source=chatgpt.com "Use Supabase Auth with React"
[18]: https://www.name.com/support/articles/115010493967-adding-an-aname-alias-record?utm_source=chatgpt.com "Adding an ANAME (Alias) record"
