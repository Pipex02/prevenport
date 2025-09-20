import type { FC } from 'react';

const highlights = [
  'Dashboard por vehículo con datos en español',
  'Alertas simuladas para reach stacker y tractocamión',
  'Gráficos con zoom y pan listos para Chart.js',
  'Transición sencilla a Supabase cuando el backend esté listo',
];

const App: FC = () => {
  return (
    <div className="page">
      <header className="page__header">
        <span className="page__brand">PREVENPORT</span>
        <nav className="page__nav">
          <a href="#beneficios">Beneficios</a>
          <a href="#telemetria">Telemetría</a>
          <a href="https://app.prevenport.dev" target="_blank" rel="noopener" className="page__nav-link">
            Abrir app
          </a>
        </nav>
      </header>
      <main className="page__main">
        <section className="hero">
          <h1>Visibilidad operativa en tiempo real para tus vehículos críticos</h1>
          <p>
            Prevenport convierte los datos de alcance de tu reach stacker y tractocamión en decisiones accionables con paneles
            diseñados para anticipar incidentes y optimizar rutas.
          </p>
          <a className="cta" href="https://app.prevenport.dev" target="_blank" rel="noopener">
            Abrir aplicación
          </a>
        </section>
        <section className="card" id="beneficios">
          <h2>Listo para tu próximo demo</h2>
          <p>
            Navegación en español, gráficos interactivos y telemetría determinística cada 5&nbsp;segundos para mostrar el valor sin
            depender de un backend todavía.
          </p>
          <ul className="pill-list">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="card" id="telemetria">
          <h2>Telemetría bajo control</h2>
          <p>
            Los datos generados con semillas fijas aseguran que la historia sea consistente en cada demo, facilitando el paso a
            Supabase cuando el backend esté listo.
          </p>
          <ul className="pill-list">
            <li>RPM, velocidad y temperatura</li>
            <li>Carga vs. consumo</li>
            <li>Selector de rango temporal</li>
            <li>Restablecer zoom al instante</li>
          </ul>
        </section>
      </main>
      <footer className="page__footer">
        &copy; {new Date().getFullYear()} Prevenport — Contacto:{' '}
        <a href="mailto:hola@prevenport.dev">hola@prevenport.dev</a>
      </footer>
    </div>
  );
};

export default App;
