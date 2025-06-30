import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotificaciones } from '../../contexto/ContextoNotificaciones';
import './IniciarSesion.scss';

const IniciarSesion = () => {
  const { iniciarSesion, cargando } = useAuth();
  const navigate = useNavigate();
  const { mostrarNotificacion } = useNotificaciones();
  const location = useLocation();
  
  const [credenciales, setCredenciales] = useState({
    email: '',
    password: ''
  });

  const [errores, setErrores] = useState({});
  const [errorBackend, setErrorBackend] = useState('');

  const from = location.state?.from?.pathname || '/';
  const mensaje = location.state?.mensaje;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredenciales(prev => ({
      ...prev,
      [name]: value
    }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!credenciales.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(credenciales.email)) {
      nuevosErrores.email = 'El email no es válido';
    }
    if (!credenciales.password.trim()) {
      nuevosErrores.password = 'La contraseña es obligatoria';
    }
    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setErrorBackend('');
    
    try {
      const respuesta = await iniciarSesion(credenciales);
      if (respuesta && respuesta.token) {
        mostrarNotificacion('Inicio de sesión exitoso', 'success');
        navigate(from, { replace: true });
      }
    } catch (error) {
      setErrorBackend(error.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="contenedor fade-in">
      <div className="form-login">
        <h2>Iniciar Sesión</h2>
        
        {mensaje && (
          <div className="mensaje-info">
            {mensaje}
          </div>
        )}

        {errorBackend && (
          <div className="error-mensaje">
            {errorBackend}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credenciales.email}
              onChange={handleInputChange}
              className={errores.email ? 'error' : ''}
              disabled={cargando}
              placeholder="tu@email.com"
            />
            {errores.email && <span className="error-texto">{errores.email}</span>}
          </div>

          <div className="form-grupo">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credenciales.password}
              onChange={handleInputChange}
              className={errores.password ? 'error' : ''}
              disabled={cargando}
              placeholder="Tu contraseña"
            />
            {errores.password && <span className="error-texto">{errores.password}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primario"
            disabled={cargando}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mensaje-info">
          ¿No tienes cuenta? 
          <a href="/registro"> Regístrate aquí</a>
        </div>
      </div>
    </div>
  );
};

export default IniciarSesion; 