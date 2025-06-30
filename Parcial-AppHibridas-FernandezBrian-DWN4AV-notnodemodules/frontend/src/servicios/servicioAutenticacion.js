import axios from 'axios';
const BASE_URL = 'http://localhost:3000/api/user';

export const servicioAutenticacion = {
  registrar: async (datosUsuario) => {
    const response = await axios.post(BASE_URL, datosUsuario);
    return response.data;
  },

  iniciarSesion: async (credenciales) => {
    const response = await axios.post(`${BASE_URL}/login`, credenciales);
    return response.data;
  },

  obtenerPerfil: async (token) => {
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default servicioAutenticacion; 