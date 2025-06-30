import Entrenamiento from '../models/EntrenamientoModel.js';

export const obtenerEntrenamientosOrdenadosPorTipo = async ({ filtro = {}, page = 1, limit = 10, order = 'asc' }) => {
  const skip = (page - 1) * limit;
  const sortOrder = order === 'desc' ? -1 : 1;

  const entrenamientos = await Entrenamiento.find(filtro)
    .sort({ tipo: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await Entrenamiento.countDocuments(filtro);

  return { total, page, limit, entrenamientos };
};
