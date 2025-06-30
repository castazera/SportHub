import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.scss';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { estaAutenticado, usuario, cerrarSesion } = useAuth();

  const esEnlaceActivo = (ruta) => {
    return location.pathname === ruta;
  };

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navigate('/', { replace: true });
  };

  const manejarClickRutaProtegida = (e, ruta) => {
    e.preventDefault();
    if (!estaAutenticado) {
      navigate('/iniciar-sesion', { 
        state: { 
          from: { pathname: ruta },
          mensaje: 'Debes iniciar sesión para acceder a esta funcionalidad'
        }
      });
    } else {
      navigate(ruta);
    }
  };

  return (
    <header className="header">
      <div className="contenedor-header">
        <div className="logo">
          <Link to="/" className="logo-enlace">
            <span className="logo-icono">🎮</span>
            <span className="logo-texto">SportHub Training</span>
          </Link>
        </div>
        
        <nav className="navegacion">
          <ul className="nav-lista">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-enlace ${esEnlaceActivo('/') ? 'activo' : ''}`}
              >
                Inicio
              </Link>
            </li>
            
            <li className="nav-item">
              <a 
                href="/jugadores"
                onClick={(e) => manejarClickRutaProtegida(e, '/jugadores')}
                className={`nav-enlace ${esEnlaceActivo('/jugadores') ? 'activo' : ''}`}
              >
                Jugadores
              </a>
            </li>
            
            <li className="nav-item">
              <a 
                href="/entrenamientos"
                onClick={(e) => manejarClickRutaProtegida(e, '/entrenamientos')}
                className={`nav-enlace ${esEnlaceActivo('/entrenamientos') ? 'activo' : ''}`}
              >
                Entrenamientos
              </a>
            </li>
            
            {estaAutenticado ? (
              <li className="nav-item usuario-info">
                <span className="usuario-saludo">
                  Hola, <strong>{usuario?.username || 'Usuario'}</strong>
                </span>
                <button 
                  onClick={manejarCerrarSesion}
                  className="btn btn-cerrar-sesion"
                >
                  Cerrar Sesión
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    to="/iniciar-sesion" 
                    className={`nav-enlace ${esEnlaceActivo('/iniciar-sesion') ? 'activo' : ''}`}
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/registro" 
                    className={`nav-enlace ${esEnlaceActivo('/registro') ? 'activo' : ''}`}
                  >
                    Registro
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 