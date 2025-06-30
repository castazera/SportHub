import { useApi } from './useApi';

export const useServicios = () => {
  const { get, post, put, del, cargando, error, limpiarError } = useApi();

  const obtenerJugadores = async (page = 1, limit = 10, order = 'asc') => {
    const params = new URLSearchParams({ page, limit, order });
    return await get(`/api/jugadores?${params}`);
  };

  const crearJugador = async (jugadorData) => {
    return await post('/api/jugadores', jugadorData);
  };

  const actualizarJugador = async (id, jugadorData) => {
    return await put(`/api/jugadores/${id}`, jugadorData);
  };

  const eliminarJugador = async (id) => {
    return await del(`/api/jugadores/${id}`);
  };

  const obtenerEntrenamientos = async (page = 1) => {
    return await get(`/api/entrenamientos?page=${page}`);
  };

  const crearEntrenamiento = async (entrenamientoData) => {
    return await post('/api/entrenamientos', entrenamientoData);
  };

  const actualizarEntrenamiento = async (id, entrenamientoData) => {
    return await put(`/api/entrenamientos/${id}`, entrenamientoData);
  };

  const eliminarEntrenamiento = async (id) => {
    return await del(`/api/entrenamientos/${id}`);
  };

  return {
    obtenerJugadores,
    crearJugador,
    actualizarJugador,
    eliminarJugador,
    obtenerEntrenamientos,
    crearEntrenamiento,
    actualizarEntrenamiento,
    eliminarEntrenamiento,
    cargando,
    error,
    limpiarError
  };
}; 