import { useContext } from 'react';
import { ContextoAutenticacion } from '../contexto/ContextoAutenticacion';

export const useAuth = () => {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error('useAuth debe ser usado dentro de un ProveedorAutenticacion');
  }
  return contexto;
}; 