import React, { createContext, useContext, useState, useCallback } from 'react';

const ContextoNotificaciones = createContext();

export const useNotificaciones = () => {
  const contexto = useContext(ContextoNotificaciones);
  if (!contexto) {
    throw new Error('useNotificaciones debe usarse dentro de ProveedorNotificaciones');
  }
  return contexto;
};

export const ProveedorNotificaciones = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  const mostrarNotificacion = useCallback((mensaje, tipo = 'info', duracion = 5000) => {
    const nuevaNotificacion = {
      id: Date.now() + Math.random(),
      mensaje,
      tipo,
      duracion
    };

    setNotificaciones(prev => [...prev, nuevaNotificacion]);

    if (duracion > 0) {
      setTimeout(() => {
        removerNotificacion(nuevaNotificacion.id);
      }, duracion);
    }
  }, []);

  const removerNotificacion = useCallback((id) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const limpiarNotificaciones = useCallback(() => {
    setNotificaciones([]);
  }, []);

  const valor = {
    notificaciones,
    mostrarNotificacion,
    removerNotificacion,
    limpiarNotificaciones
  };

  return (
    <ContextoNotificaciones.Provider value={valor}>
      {children}
    </ContextoNotificaciones.Provider>
  );
}; 