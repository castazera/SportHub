import { useState, useCallback, useMemo } from 'react';
import { useApiOptimizado } from './useApiOptimizado';
import { useConfig } from './useConfig';

/**
 * Hook optimizado para gestión de jugadores con cache inteligente y búsqueda
 */
export const useJugadores = () => {
  const api = useApiOptimizado();
  const config = useConfig();
  const [jugadores, setJugadores] = useState([]);
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });


  const endpoints = useMemo(() => config.api.endpoints.jugadores, [config.api.endpoints.jugadores]);


  const construirUrlPaginada = useCallback((params = {}) => {
    const urlParams = new URLSearchParams({
      page: params.page || paginacion.page,
      limit: params.limit || paginacion.limit,
      ...params
    });
    
    return `${endpoints.base}?${urlParams.toString()}`;
  }, [endpoints.base, paginacion.page, paginacion.limit]);


  const obtenerJugadores = useCallback(async (opciones = {}) => {
    try {
      const url = construirUrlPaginada(opciones);
      const respuesta = await api.get(url);

      if (respuesta) {
        const datos = {
          jugadores: respuesta.jugadores || respuesta,
          total: respuesta.total || (Array.isArray(respuesta) ? respuesta.length : 0),
          page: respuesta.page || 1,
          limit: respuesta.limit || 10,
          totalPages: respuesta.totalPages || Math.ceil((respuesta.total || 0) / 10)
        };

        setJugadores(datos.jugadores);
        setPaginacion({
          page: datos.page,
          limit: datos.limit,
          total: datos.total,
          totalPages: datos.totalPages
        });

        return datos;
      }
    } catch (error) {
      console.error('Error al obtener jugadores:', error);
      setJugadores([]);
      throw error;
    }
  }, [api, construirUrlPaginada]);


  const obtenerJugadorPorId = useCallback(async (id) => {
    try {
      const url = endpoints.byId(id);
      return await api.get(url);
    } catch (error) {
      console.error('Error al obtener jugador:', error);
      throw error;
    }
  }, [api, endpoints]);

  
  const crearJugador = useCallback(async (datosJugador) => {
    try {
      if (!datosJugador.name || !datosJugador.nickname) {
        throw new Error('Nombre y nickname son obligatorios');
      }

      const jugadorCreado = await api.post(endpoints.base, datosJugador);
      
      if (jugadorCreado) {
        setJugadores(prev => [jugadorCreado, ...prev]);
        setPaginacion(prev => ({ ...prev, total: prev.total + 1 }));
      }
      
      return jugadorCreado;
    } catch (error) {
      console.error('Error al crear jugador:', error);
      throw error;
    }
  }, [api, endpoints.base]);

  const actualizarJugador = useCallback(async (id, datosJugador) => {
    try {
      const url = endpoints.byId(id);
      const jugadorActualizado = await api.put(url, datosJugador);
      
      if (jugadorActualizado) {
        setJugadores(prev => 
          prev.map(jugador => 
            jugador._id === id ? { ...jugador, ...jugadorActualizado } : jugador
          )
        );
      }
      
      return jugadorActualizado;
    } catch (error) {
      console.error('Error al actualizar jugador:', error);
      throw error;
    }
  }, [api, endpoints]);

  const eliminarJugador = useCallback(async (id) => {
    try {
      const url = endpoints.byId(id);
      const resultado = await api.del(url);
      
      if (resultado) {
        setJugadores(prev => prev.filter(jugador => jugador._id !== id));
        setPaginacion(prev => ({ ...prev, total: prev.total - 1 }));
      }
      
      return resultado;
    } catch (error) {
      console.error('Error al eliminar jugador:', error);
      throw error;
    }
  }, [api, endpoints]);

  const buscarJugadores = useCallback(async (termino, opciones = {}) => {
    try {
      if (!termino.trim()) {
        return obtenerJugadores();
      }

      const params = {
        busqueda: termino,
        page: 1,
        ...opciones
      };
      
      return obtenerJugadores(params);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      throw error;
    }
  }, [obtenerJugadores]);

  return {
    jugadores,
    paginacion,
    cargando: api.cargando,
    error: api.error,
    obtenerJugadores,
    obtenerJugadorPorId,
    crearJugador,
    actualizarJugador,
    eliminarJugador,
    buscarJugadores
  };
}; 