import React from 'react';
import { useNotificaciones } from '../../contexto/ContextoNotificaciones';
import './Notificaciones.scss';

const IconoNotificacion = ({ tipo }) => {
  const iconos = {
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20,6 9,17 4,12"/>
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
    )
  };

  return iconos[tipo] || iconos.info;
};

const Notificacion = React.memo(({ notificacion, onRemover }) => {
  const { id, mensaje, tipo } = notificacion;

  const handleCerrar = () => {
    onRemover(id);
  };

  return (
    <div 
      className={`notificacion notificacion-${tipo}`}
      role="alert"
      aria-live="polite"
    >
      <div className="notificacion-contenido">
        <div className="notificacion-icono">
          <IconoNotificacion tipo={tipo} />
        </div>
        
        <div className="notificacion-mensaje">
          {mensaje}
        </div>
        
        <button 
          className="notificacion-cerrar"
          onClick={handleCerrar}
          aria-label="Cerrar notificación"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      
      {/* Barra de progreso para notificaciones con duración */}
      {notificacion.duracion > 0 && (
        <div 
          className="notificacion-progreso"
          style={{
            animationDuration: `${notificacion.duracion}ms`
          }}
        />
      )}
    </div>
  );
});

Notificacion.displayName = 'Notificacion';

const ContenedorNotificaciones = () => {
  const { notificaciones, removerNotificacion } = useNotificaciones();

  if (notificaciones.length === 0) {
    return null;
  }

  return (
    <div className="contenedor-notificaciones">
      {notificaciones.map((notificacion) => (
        <Notificacion
          key={notificacion.id}
          notificacion={notificacion}
          onRemover={removerNotificacion}
        />
      ))}
    </div>
  );
};

export default ContenedorNotificaciones; 