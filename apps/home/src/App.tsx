import type { FC } from 'react';
import { Hero } from './components/Hero';
import { SocialProof } from './components/SocialProof';
import { Benefits } from './components/Benefits';

const App: FC = () => {
  return (
    <div className="page">
      <header className="page__header">
        <span className="page__brand">PREVENPORT</span>
        <nav className="page__nav">
          <a href="#beneficios-titulo">Beneficios</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="https://app.prevenport.dev" target="_blank" rel="noopener">
            Abrir app
          </a>
        </nav>
      </header>
      <main className="page__main">
        <Hero />
        <Benefits />
        <SocialProof />
      </main>
      <footer className="page__footer">
        &copy; {new Date().getFullYear()} Prevenport — Contacto:{' '}
        <a href="mailto:hola@prevenport.dev">hola@prevenport.dev</a>
      </footer>
    </div>
  );
};

export default App;
