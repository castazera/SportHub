import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useApi = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  const manejarError = useCallback((error, url = '') => {
    console.error(`Error en API ${url}:`, error);
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 401:
          setError('No tienes permisos para acceder. Inicia sesión.');
          break;
        case 403:
          setError('No tienes permisos para realizar esta acción.');
          break;
        case 404:
          setError('El recurso solicitado no fue encontrado.');
          break;
        case 422:
          if (data.message === 'Datos inválidos' && data.detalles) {
            const mensajeDetallado = Array.isArray(data.detalles) 
              ? data.detalles.join(', ')
              : data.detalles;
            setError(`Datos inválidos: ${mensajeDetallado}`);
          } else {
            setError(data.message || 'Error de validación en los datos enviados.');
          }
          break;
        case 500:
          setError('Error interno del servidor. Intenta más tarde.');
          break;
        default:
          setError(data.message || `Error ${status}: ${data.error || 'Error desconocido'}`);
      }
      
      throw new Error(data.message || `Error ${status}`);
    } else if (error.request) {
      setError('Error de red. Verifica tu conexión a internet.');
      throw new Error('Error de red');
    } else {
      setError('Error inesperado. Intenta nuevamente.');
      throw new Error(error.message || 'Error inesperado');
    }
  }, []);

  const crearHeaders = useCallback(() => {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }, [token]);

  const realizarPeticion = useCallback(async (url, options = {}) => {
    setCargando(true);
    setError(null);
    
    try {
      const headers = crearHeaders();
      const config = {
        headers,
        ...options
      };

      const respuesta = await fetch(url, config);
      const data = await respuesta.json();

      if (!respuesta.ok) {
        const error = new Error(`HTTP Error: ${respuesta.status}`);
        error.response = {
          status: respuesta.status,
          data: data
        };
        throw error;
      }

      return data;
    } catch (error) {
      manejarError(error, url);
    } finally {
      setCargando(false);
    }
  }, [crearHeaders, manejarError]);

  const get = useCallback(async (endpoint) => {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `http://localhost:3001${endpoint}`;
    
    return realizarPeticion(url, {
      method: 'GET'
    });
  }, [realizarPeticion]);

  const post = useCallback(async (endpoint, data) => {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `http://localhost:3001${endpoint}`;
    
    return realizarPeticion(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }, [realizarPeticion]);

  const put = useCallback(async (endpoint, data) => {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `http://localhost:3001${endpoint}`;
    
    return realizarPeticion(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }, [realizarPeticion]);

  const del = useCallback(async (endpoint) => {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `http://localhost:3001${endpoint}`;
    
    return realizarPeticion(url, {
      method: 'DELETE'
    });
  }, [realizarPeticion]);

  return {
    cargando,
    error,
    get,
    post,
    put,
    del,
    limpiarError
  };
}; 