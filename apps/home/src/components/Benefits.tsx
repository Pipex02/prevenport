import type { FC } from 'react';

const benefitItems = [
  {
    title: 'Reducción de tiempos de inactividad',
    description: 'Reciba alertas y paneles que priorizan eventos críticos, permitiendo una intervención oportuna y eficiente.'
  },
  {
    title: 'Visualización avanzada de indicadores',
    description: 'Acceda a gráficos interactivos de KPI clave, con funciones de zoom y desplazamiento para un análisis detallado.'
  },
  {
    title: 'Integración ágil y flexible',
    description: 'Conecte dispositivos edge fácilmente o utilice datos simulados para demostraciones inmediatas, sin complicaciones técnicas.'
  },
  {
    title: 'Plataforma adaptada al mercado local',
    description: 'Interfaz, métricas y reportes completamente en español, alineados con las necesidades de su operación.'
  }
];

const steps = [
  '🔗 Conecta o simula la telemetría de tu flota en minutos.',
  '📊 Visualiza KPI clave por vehículo y en paneles generales.',
  '🚦 Actúa rápido con alertas inteligentes y reportes listos para compartir.'
];

export const Benefits: FC = () => {
  return (
    <section className="benefits" aria-labelledby="beneficios-titulo">
      <h2 id="beneficios-titulo">Beneficios principales</h2>
      <div className="benefits__grid">
        {benefitItems.map((benefit) => (
          <article key={benefit.title} className="benefits__card">
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
      <div className="steps" aria-labelledby="como-funciona">
        <h3 id="como-funciona">Cómo funciona</h3>
        <ol className="steps__list">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </section>
  );
};
