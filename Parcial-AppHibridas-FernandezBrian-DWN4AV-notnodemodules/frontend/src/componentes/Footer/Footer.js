import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Footer.scss';

const Footer = () => {
  const { estaAutenticado } = useAuth();
  const año = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="contenedor">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🎮 eSports Manager</h3>
            <p>La plataforma definitiva para gestionar equipos eSports, entrenamientos y rendimiento de jugadores.</p>
          </div>

          <div className="footer-section">
            <h4>Navegación</h4>
            <ul className="footer-links">
              <li><Link to="/">🏠 Inicio</Link></li>
              {estaAutenticado ? (
                <>
                  <li><Link to="/jugadores">👥 Jugadores</Link></li>
                  <li><Link to="/entrenamientos">🏃‍♂️ Entrenamientos</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/iniciar-sesion">🔑 Iniciar Sesión</Link></li>
                  <li><Link to="/registro">📝 Registrarse</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Información</h4>
            <ul className="footer-info">
              <li>🎓 Aplicaciones Híbridas</li>
              <li>📚 DWN4AV - {año}</li>
              <li>⚡ Tecnologías: MERN Stack</li>
              <li>💻 React + Node.js + MongoDB</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-separator"></div>
          <p>
            Desarrollado con ❤️ por <strong>Brian Gabriel Fernandez</strong> - 
            Aplicaciones Híbridas - DWN4AV © {año}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 