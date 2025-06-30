import React, { createContext, useReducer, useEffect } from 'react';
import { servicioAutenticacion } from '../servicios/servicioAutenticacion';

const estadoInicial = {
  usuario: null,
  token: localStorage.getItem('token') || null,
  estaAutenticado: false,
  cargando: true,
  error: null
};

const TIPOS_ACCION = {
  INICIAR_SESION: 'INICIAR_SESION',
  CERRAR_SESION: 'CERRAR_SESION',
  ESTABLECER_CARGANDO: 'ESTABLECER_CARGANDO',
  ESTABLECER_ERROR: 'ESTABLECER_ERROR',
  LIMPIAR_ERROR: 'LIMPIAR_ERROR'
};

const reducerAutenticacion = (estado, accion) => {
  switch (accion.tipo) {
    case TIPOS_ACCION.INICIAR_SESION:
      return {
        ...estado,
        usuario: accion.payload.usuario,
        token: accion.payload.token,
        estaAutenticado: true,
        cargando: false,
        error: null
      };
    
    case TIPOS_ACCION.CERRAR_SESION:
      return {
        ...estado,
        usuario: null,
        token: null,
        estaAutenticado: false,
        cargando: false,
        error: null
      };
    
    case TIPOS_ACCION.ESTABLECER_CARGANDO:
      return {
        ...estado,
        cargando: accion.payload
      };
    
    case TIPOS_ACCION.ESTABLECER_ERROR:
      return {
        ...estado,
        error: accion.payload,
        cargando: false
      };
    
    case TIPOS_ACCION.LIMPIAR_ERROR:
      return {
        ...estado,
        error: null
      };
    
    default:
      return estado;
  }
};

export const ContextoAutenticacion = createContext();

export const ProveedorAutenticacion = ({ children }) => {
  const [estado, dispatch] = useReducer(reducerAutenticacion, estadoInicial);

  const iniciarSesion = async (credenciales) => {
    try {
      dispatch({ tipo: TIPOS_ACCION.ESTABLECER_CARGANDO, payload: true });
      dispatch({ tipo: TIPOS_ACCION.LIMPIAR_ERROR });
      
      const respuesta = await servicioAutenticacion.iniciarSesion(credenciales);
      
      if (respuesta && respuesta.token) {
        localStorage.setItem('token', respuesta.token);
        dispatch({
          tipo: TIPOS_ACCION.INICIAR_SESION,
          payload: { 
            usuario: respuesta.user, 
            token: respuesta.token 
          }
        });
        return respuesta;
      }
    } catch (error) {
      dispatch({
        tipo: TIPOS_ACCION.ESTABLECER_ERROR,
        payload: error.response?.data?.error || error.message || 'Error al iniciar sesión'
      });
      throw error;
    } finally {
      dispatch({ tipo: TIPOS_ACCION.ESTABLECER_CARGANDO, payload: false });
    }
  };

  const registrarUsuario = async (datosUsuario) => {
    try {
      dispatch({ tipo: TIPOS_ACCION.ESTABLECER_CARGANDO, payload: true });
      dispatch({ tipo: TIPOS_ACCION.LIMPIAR_ERROR });
      
      const respuesta = await servicioAutenticacion.registrar(datosUsuario);
      return respuesta;
    } catch (error) {
      dispatch({
        tipo: TIPOS_ACCION.ESTABLECER_ERROR,
        payload: error.response?.data?.error || error.message || 'Error al registrar usuario'
      });
      throw error;
    } finally {
      dispatch({ tipo: TIPOS_ACCION.ESTABLECER_CARGANDO, payload: false });
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    dispatch({ tipo: TIPOS_ACCION.CERRAR_SESION });
  };

  const establecerError = (mensaje) => {
    dispatch({
      tipo: TIPOS_ACCION.ESTABLECER_ERROR,
      payload: mensaje
    });
  };

  const limpiarError = () => {
    dispatch({ tipo: TIPOS_ACCION.LIMPIAR_ERROR });
  };

  const establecerCargando = (cargando) => {
    dispatch({
      tipo: TIPOS_ACCION.ESTABLECER_CARGANDO,
      payload: cargando
    });
  };

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const datos = await servicioAutenticacion.obtenerPerfil(token);
          dispatch({
            tipo: TIPOS_ACCION.INICIAR_SESION,
            payload: { usuario: datos, token }
          });
        } catch (error) {
          console.error('Error verificando token:', error);
          localStorage.removeItem('token');
          dispatch({ tipo: TIPOS_ACCION.CERRAR_SESION });
        }
      }
      establecerCargando(false);
    };

    verificarToken();
  }, []);

  const valor = {
    ...estado,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion,
    establecerError,
    limpiarError,
    establecerCargando
  };

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}; 