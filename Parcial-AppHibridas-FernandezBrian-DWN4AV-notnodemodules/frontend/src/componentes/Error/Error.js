import React from 'react';
import './Error.scss';

const Error = ({ mensaje, onCerrar, tipo = 'error' }) => {
  return (
    <div className={`error-component error-${tipo}`}>
      <div className="error-contenido">
        <p className="error-mensaje">{mensaje}</p>
        {onCerrar && (
          <button className="error-cerrar" onClick={onCerrar}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Error; 