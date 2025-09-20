import type { FC } from 'react';
import { ClockArrowDown, ChartNetwork, Waypoints, MapPinHouse } from 'lucide-react';

const benefitItems = [
  {
    title: 'Reducción de tiempos de inactividad',
    description: 'Reciba alertas y paneles que priorizan eventos críticos, permitiendo una intervención oportuna y eficiente.',
    Icon: ClockArrowDown,
  },
  {
    title: 'Visualización avanzada de indicadores',
    description: 'Acceda a gráficos interactivos de KPI clave, con funciones de zoom y desplazamiento para un análisis detallado.',
    Icon: ChartNetwork,
  },
  {
    title: 'Integración ágil y flexible',
    description: 'Conecte dispositivos edge fácilmente o utilice datos simulados para demostraciones inmediatas, sin complicaciones técnicas.',
    Icon: Waypoints,
  },
  {
    title: 'Plataforma adaptada al mercado local',
    description: 'Interfaz, métricas y reportes completamente en español, alineados con las necesidades de su operación.',
    Icon: MapPinHouse,
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
        {benefitItems.map(({ title, description, Icon }) => (
          <article key={title} className="benefits__card">
            <div className="benefits__icon" aria-hidden>
              <Icon className="benefits__icon-svg" />
            </div>
            <div className="benefits__content">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
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
