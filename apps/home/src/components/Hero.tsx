import type { FC } from 'react';

export const Hero: FC = () => {
  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <h1 id="hero-titulo">Visibilidad operativa en tiempo real para tus vehículos</h1>
      <p className="hero__description">
        Prevenport centraliza la telemetría de tus reach stackers y tractocamiones para anticipar fallas, reducir tiempos muertos y
        ofrecer demos sin depender de un backend.
      </p>
      <a className="hero__cta" href="https://app.prevenport.dev" target="_blank" rel="noopener">
        Abrir aplicación
      </a>
    </section>
  );
};
