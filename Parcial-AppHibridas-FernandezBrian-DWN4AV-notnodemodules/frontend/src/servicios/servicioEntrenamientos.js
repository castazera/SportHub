import axios from 'axios';
const BASE_URL = 'http://localhost:3000/api/entrenamientos';

export const servicioEntrenamientos = {
  
  obtenerTodos: async (page = 1, limit = 10) => {
    const response = await axios.get(`${BASE_URL}?page=${page}&limit=${limit}`);
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  crear: async (datosEntrenamiento) => {
    const response = await axios.post(BASE_URL, datosEntrenamiento);
    return response.data;
  },

  actualizar: async (id, datosEntrenamiento) => {
    const response = await axios.put(`${BASE_URL}/${id}`, datosEntrenamiento);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  obtenerPorJugador: async (jugadorId) => {
    const response = await axios.get(`${BASE_URL}/jugador/${jugadorId}`);
    return response.data;
  },

  obtenerPorFecha: async (fecha) => {
    const response = await axios.get(`${BASE_URL}/fecha/${fecha}`);
    return response.data;
  }
};

export default servicioEntrenamientos; 