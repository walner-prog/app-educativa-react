import React from 'react';
import { Protect } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function PlanBasic() {
  return (
    <Protect
      plan="plan_basico"
      fallback={
        <p>
          Necesitas suscribirte para ver este contenido.{' '}
          <Link to="/pricing" style={{ color: 'blue', textDecoration: 'underline' }}>
            Ir a planes y precios
          </Link>
        </p>
      }
    >
      <h2>Contenido exclusivo para suscriptores Básico</h2>
      {/* contenido premium */}
    </Protect>
  );
}
