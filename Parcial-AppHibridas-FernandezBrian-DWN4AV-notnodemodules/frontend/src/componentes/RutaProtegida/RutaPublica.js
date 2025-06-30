import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RutaPublica = ({ children }) => {
  const { estaAutenticado } = useAuth();

  if (estaAutenticado) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaPublica; 