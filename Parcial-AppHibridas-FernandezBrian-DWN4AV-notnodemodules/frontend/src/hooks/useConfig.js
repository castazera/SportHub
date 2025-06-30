import { useMemo } from 'react';

/**
 * Hook para configuración centralizada de la aplicación
 * Maneja URLs base, timeouts, configuraciones de API, etc.
 */
export const useConfig = () => {
  const config = useMemo(() => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    
    return {
      api: {
        baseUrl: API_BASE_URL,
        timeout: 10000,
        endpoints: {
          jugadores: '/jugadores',
          entrenamientos: '/entrenamientos',
          auth: '/users'
        }
      },
      cache: {
        timeout: 300000
      },
      notificaciones: {
        duracionPorDefecto: 5000
      }
    };
  }, []);

  return config;
}; 