import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../Loading/Loading';

const RutaProtegida = ({ children }) => {
  const { estaAutenticado, cargando } = useAuth();
  const ubicacion = useLocation();


  if (cargando) {
    return <Loading />;
  }

  if (!estaAutenticado) {
    return <Navigate to="/iniciar-sesion" state={{ desde: ubicacion }} replace />;
  }

  return children;
};

export default RutaProtegida; 