import axios from 'axios';
const BASE_URL = 'http://localhost:3000/api/jugadores';

export const servicioJugadores = {
  
  obtenerTodos: async (page = 1, limit = 10) => {
    const response = await axios.get(`${BASE_URL}?page=${page}&limit=${limit}`);
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  obtenerPorNickname: async (nickname) => {
    const response = await axios.get(`${BASE_URL}/nickname/${nickname}`);
    return response.data;
  },

  crear: async (datosJugador) => {
    const response = await axios.post(BASE_URL, datosJugador);
    return response.data;
  },

  actualizar: async (id, datosJugador) => {
    const response = await axios.put(`${BASE_URL}/${id}`, datosJugador);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  obtenerPorJuego: async (juego) => {
    const response = await axios.get(`${BASE_URL}/juego/${juego}`);
    return response.data;
  },

  obtenerPorNivel: async (nivel) => {
    const response = await axios.get(`${BASE_URL}/nivel/${nivel}`);
    return response.data;
  }
};

export default servicioJugadores; 