import type { FC } from 'react';

export const SocialProof: FC = () => {
  return (
    <section className="social-proof" aria-labelledby="asesoria-heading">
      <div className="social-proof__container">
        <h2 id="asesoria-heading">Asesoría académica</h2>
        <p>
          Con asesoría de la Universidad del Norte (Barranquilla).
          <span className="social-proof__note">
            Nota: asesoría académica; la Universidad del Norte no patrocina ni endosa este servicio.
          </span>
        </p>
      </div>
    </section>
  );
};
