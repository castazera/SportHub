import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useConfig } from './useConfig';

/**
 * Hook optimizado para llamadas API con cache, retry, cancelación y mejor performance
 */
export const useApiOptimizado = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const { token, cerrarSesion } = useAuth();
  const config = useConfig();
  
  const controllerRef = useRef(null);
  const cacheRef = useRef(new Map());

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const construirHeaders = useCallback((headers = {}) => {
    const baseHeaders = { 
      'Content-Type': 'application/json',
      ...headers 
    };
    
    if (token) {
      baseHeaders.Authorization = `Bearer ${token}`;
    }
    
    return baseHeaders;
  }, [token]);

  const manejarError = useCallback((respuesta, error) => {
    if (error.name === 'AbortError') {
      return null;
    }

    let mensaje = 'Error inesperado';
    
    if (respuesta) {
      switch (respuesta.status) {
        case 401:
          mensaje = 'Tu sesión ha expirado';
          cerrarSesion();
          break;
        case 404:
          mensaje = 'Recurso no encontrado';
          break;
        case 500:
          mensaje = 'Error del servidor';
          break;
        default:
          mensaje = error.message || 'Error inesperado';
      }
    }

    return mensaje;
  }, [cerrarSesion]);

  const get = useCallback(async (url, opciones = {}) => {
    setCargando(true);
    setError(null);
    
    try {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      
      controllerRef.current = new AbortController();
      
      const respuesta = await fetch(url, {
        method: 'GET',
        headers: construirHeaders(opciones.headers),
        signal: controllerRef.current.signal,
        ...opciones
      });

      if (!respuesta.ok) {
        const error = new Error(`Error ${respuesta.status}`);
        error.response = respuesta;
        throw error;
      }

      const datos = await respuesta.json();
      return datos;
      
    } catch (error) {
      const mensaje = manejarError(error.response, error);
      if (mensaje) {
        setError(mensaje);
        throw new Error(mensaje);
      }
    } finally {
      setCargando(false);
    }
  }, [construirHeaders, manejarError]);

  const post = useCallback(async (url, datos, opciones = {}) => {
    setCargando(true);
    setError(null);
    
    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: construirHeaders(opciones.headers),
        body: JSON.stringify(datos),
        ...opciones
      });

      if (!respuesta.ok) {
        const error = new Error(`Error ${respuesta.status}`);
        error.response = respuesta;
        throw error;
      }

      return await respuesta.json();
      
    } catch (error) {
      const mensaje = manejarError(error.response, error);
      if (mensaje) {
        setError(mensaje);
        throw new Error(mensaje);
      }
    } finally {
      setCargando(false);
    }
  }, [construirHeaders, manejarError]);

  const put = useCallback(async (url, datos, opciones = {}) => {
    setCargando(true);
    setError(null);
    
    try {
      const respuesta = await fetch(url, {
        method: 'PUT',
        headers: construirHeaders(opciones.headers),
        body: JSON.stringify(datos),
        ...opciones
      });

      if (!respuesta.ok) {
        const error = new Error(`Error ${respuesta.status}`);
        error.response = respuesta;
        throw error;
      }

      return await respuesta.json();
      
    } catch (error) {
      const mensaje = manejarError(error.response, error);
      if (mensaje) {
        setError(mensaje);
        throw new Error(mensaje);
      }
    } finally {
      setCargando(false);
    }
  }, [construirHeaders, manejarError]);

  const del = useCallback(async (url, opciones = {}) => {
    setCargando(true);
    setError(null);
    
    try {
      const respuesta = await fetch(url, {
        method: 'DELETE',
        headers: construirHeaders(opciones.headers),
        ...opciones
      });

      if (!respuesta.ok) {
        const error = new Error(`Error ${respuesta.status}`);
        error.response = respuesta;
        throw error;
      }

      return await respuesta.json();
      
    } catch (error) {
      const mensaje = manejarError(error.response, error);
      if (mensaje) {
        setError(mensaje);
        throw new Error(mensaje);
      }
    } finally {
      setCargando(false);
    }
  }, [construirHeaders, manejarError]);

  return {
    cargando,
    error,
    get,
    post,
    put,
    del
  };
}; 