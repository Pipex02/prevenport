import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Chart,
  type ChartConfiguration,
  type ChartData,
  LinearScale,
  LineController,
  LineElement,
  CategoryScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  ScatterController,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';
import { generateTelemetry } from './lib/mockTelemetry';

Chart.register(
  LineController,
  ScatterController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin,
);

const vehicles = [
  {
    id: 'reach-stacker',
    name: 'Reach Stacker',
    status: 'online' as const,
    alerts: ['Revisión hidráulica en 3 días'],
    seed: 1.2,
  },
  {
    id: 'tractocamion',
    name: 'Tractocamión',
    status: 'delay' as const,
    alerts: ['Vibración sensor rueda 2'],
    seed: 2.8,
  },
];

const devices = [
  { name: 'Edge RPi #1', status: 'online' as const, lastSeen: 'hace 3 min', version: 'v0.9.2' },
  { name: 'Edge RPi #2', status: 'offline' as const, lastSeen: 'hace 27 min', version: 'v0.9.2' },
];

const ranges = [
  { label: '1 h', hours: 1 },
  { label: '24 h', hours: 24 },
  { label: '7 días', hours: 168 },
];

type DataSource = 'mock' | 'supabase';

type Status = 'online' | 'delay' | 'offline';

type TelemetryChartData = ReturnType<typeof generateTelemetry>;

const statusClass: Record<Status, string> = {
  online: 'status-dot status-dot--online',
  delay: 'status-dot status-dot--delay',
  offline: 'status-dot status-dot--offline',
};

const buildLineData = (telemetry: TelemetryChartData): ChartData<'line'> => ({
  labels: telemetry.labels,
  datasets: [
    {
      label: 'RPM',
      data: telemetry.rpm,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.16)',
      tension: 0.35,
      fill: 'origin',
    },
    {
      label: 'Velocidad (km/h)',
      data: telemetry.speed,
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.16)',
      tension: 0.35,
      fill: false,
    },
    {
      label: 'Temperatura (°C)',
      data: telemetry.temperature,
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.16)',
      tension: 0.35,
      fill: false,
    },
  ],
});

const buildScatterData = (telemetry: TelemetryChartData): ChartData<'scatter'> => ({
  datasets: [
    {
      label: 'Consumo vs RPM',
      data: telemetry.consumption.map((consumption, index) => ({
        x: consumption,
        y: telemetry.rpm[index],
      })),
      backgroundColor: 'rgba(129, 140, 248, 0.6)',
    },
  ],
});

const App = () => {
  const [dataSource, setDataSource] = useState<DataSource>('mock');
  const [activeVehicleId, setActiveVehicleId] = useState(vehicles[0].id);
  const [hours, setHours] = useState(ranges[1].hours);
  const [telemetry, setTelemetry] = useState(() => generateTelemetry(vehicles[0].seed, ranges[1].hours));
  const [showLogin, setShowLogin] = useState(false);

  const lineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scatterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lineChartRef = useRef<Chart<'line'> | null>(null);
  const scatterChartRef = useRef<Chart<'scatter'> | null>(null);

  const activeVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === activeVehicleId) ?? vehicles[0],
    [activeVehicleId],
  );

  useEffect(() => {
    setTelemetry(generateTelemetry(activeVehicle.seed, hours));
  }, [activeVehicle, hours]);

  useEffect(() => {
    if (dataSource !== 'mock') {
      return undefined;
    }
    const id = window.setInterval(() => {
      setTelemetry(generateTelemetry(activeVehicle.seed, hours));
    }, 5000);
    return () => window.clearInterval(id);
  }, [activeVehicle, hours, dataSource]);

  useLayoutEffect(() => {
    const lineCanvas = lineCanvasRef.current;
    const scatterCanvas = scatterCanvasRef.current;

    if (!lineCanvas || !scatterCanvas || !lineCanvas.ownerDocument || !scatterCanvas.ownerDocument) {
      return undefined;
    }

    if (!lineCanvas.parentElement || !scatterCanvas.parentElement) {
      return undefined;
    }

    const lineConfig: ChartConfiguration<'line'> = {
      type: 'line',
      data: buildLineData(telemetry),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'nearest' },
        scales: {
          x: {
            type: 'time',
            adapters: {
              date: { locale: es },
            },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.12)' },
          },
          y: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.12)' },
          },
        },
        plugins: {
          legend: { labels: { color: '#e2e8f0' } },
          zoom: {
            limits: {
              x: { minRange: 10 * 60 * 1000 },
            },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: 'x',
            },
            pan: {
              enabled: true,
              mode: 'x',
            },
          },
        },
      },
    };

    const scatterConfig: ChartConfiguration<'scatter'> = {
      type: 'scatter',
      data: buildScatterData(telemetry),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Consumo (L/100 km)', color: '#94a3b8' },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.12)' },
          },
          y: {
            title: { display: true, text: 'RPM', color: '#94a3b8' },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.12)' },
          },
        },
        plugins: {
          legend: { labels: { color: '#e2e8f0' } },
        },
      },
    };

    lineChartRef.current = new Chart(lineCanvas, lineConfig);
    scatterChartRef.current = new Chart(scatterCanvas, scatterConfig);

    return () => {
      lineChartRef.current?.destroy();
      scatterChartRef.current?.destroy();
      lineChartRef.current = null;
      scatterChartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!lineChartRef.current || !scatterChartRef.current) {
      return;
    }
    lineChartRef.current.data = buildLineData(telemetry);
    lineChartRef.current.update('none');

    scatterChartRef.current.data = buildScatterData(telemetry);
    scatterChartRef.current.update('none');
  }, [telemetry]);

  const latestIndex = telemetry.labels.length - 1;
  const metrics = [
    { label: 'RPM', value: telemetry.rpm[latestIndex], unit: 'rpm' },
    { label: 'Velocidad', value: telemetry.speed[latestIndex], unit: 'km/h' },
    { label: 'Temperatura motor', value: telemetry.temperature[latestIndex], unit: '°C' },
    { label: 'Consumo', value: telemetry.consumption[latestIndex]?.toFixed(1), unit: 'L/100 km' },
  ];

  return (
    <div className="app">
      <header className="app__header">
        <h1>APP.PREVENPORT.DEV</h1>
        <nav className="app__nav">
          <a href="#panel">Panel</a>
          <a href="#vehiculos">Vehículos</a>
          <a href="#dispositivos">Dispositivos</a>
          <button type="button" className="link" onClick={() => setShowLogin(true)}>
            Ingresar
          </button>
        </nav>
      </header>
      <div className="app__layout" id="panel">
        <aside className="app__sidebar">
          <section>
            <h2>Fuente de datos</h2>
            <div className="toggle">
              <button
                type="button"
                className={`toggle__btn ${dataSource === 'mock' ? 'toggle__btn--active' : ''}`}
                onClick={() => setDataSource('mock')}
              >
                Mock
              </button>
              <button type="button" className="toggle__btn" disabled>
                Supabase (próximamente)
              </button>
            </div>
          </section>
          <section>
            <h2>Vehículos</h2>
            <div className="vehicle-list">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  className={`vehicle-card ${vehicle.id === activeVehicleId ? 'vehicle-card--active' : ''}`}
                  onClick={() => setActiveVehicleId(vehicle.id)}
                >
                  <div className="vehicle-card__title">
                    <strong>{vehicle.name}</strong>
                    <span className={statusClass[vehicle.status]} aria-hidden />
                  </div>
                  <small>{vehicle.alerts.length} alerta{vehicle.alerts.length !== 1 ? 's' : ''}</small>
                </button>
              ))}
            </div>
          </section>
        </aside>
        <main className="app__content">
          <section className="card">
            <h2>Resumen operativo</h2>
            <div className="metrics">
              {metrics.map((metric) => (
                <article key={metric.label} className="metric-card">
                  <h3>{metric.label}</h3>
                  <span className="metric-value">{metric.value}</span>
                  <small>{metric.unit}</small>
                </article>
              ))}
            </div>
          </section>
          <section className="card">
            <h2>Gráficos en tiempo real</h2>
            <div className="actions">
              {ranges.map((range) => (
                <button
                  key={range.hours}
                  type="button"
                  className={`btn ${hours === range.hours ? 'btn--primary' : ''}`}
                  onClick={() => setHours(range.hours)}
                >
                  {range.label}
                </button>
              ))}
              <button
                type="button"
                className="btn"
                onClick={() => lineChartRef.current?.resetZoom?.()}
              >
                Restablecer zoom
              </button>
            </div>
            <div className="charts">
              <div className="chart-wrapper">
                <canvas ref={lineCanvasRef} aria-label="Líneas de telemetría" />
              </div>
              <div className="chart-wrapper">
                <canvas ref={scatterCanvasRef} aria-label="Dispersión consumo vs rpm" />
              </div>
            </div>
          </section>
          <section className="card" id="vehiculos">
            <h2>Alertas rápidas</h2>
            <div className="grid">
              {vehicles.map((vehicle) => (
                <article key={vehicle.id} className="device-card">
                  <header>
                    <strong>{vehicle.name}</strong>
                  </header>
                  <p className="muted">{vehicle.alerts.join(', ')}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="card" id="dispositivos">
            <h2>Dispositivos edge</h2>
            <div className="grid">
              {devices.map((device) => (
                <article key={device.name} className="device-card">
                  <header className="device-card__header">
                    <strong>{device.name}</strong>
                    <span className={statusClass[device.status]} aria-hidden />
                  </header>
                  <p className="muted">Última señal: {device.lastSeen}</p>
                  <p className="muted">Versión: {device.version}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
      {showLogin ? (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__content">
            <h2>Autenticación en camino</h2>
            <p>
              Estamos preparando la integración con Supabase Auth. Por ahora puedes explorar la app con datos demo y telemetría
              determinística.
            </p>
            <button type="button" className="btn" onClick={() => setShowLogin(false)}>
              Entendido
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default App;
