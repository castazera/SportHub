import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Inicio.scss';

const Inicio = () => {
  const navigate = useNavigate();
  const { usuario, estaAutenticado } = useAuth();

  const navegarA = (ruta) => {
    navigate(ruta);
  };

  const tarjetasNavegacion = [
    {
      titulo: 'Jugadores',
      descripcion: 'Gestiona tu equipo de jugadores profesionales',
      icono: '👥',
      ruta: '/jugadores',
      color: 'azul'
    },
    {
      titulo: 'Entrenamientos',
      descripcion: 'Programa y organiza sesiones de entrenamiento',
      icono: '🎮',
      ruta: '/entrenamientos',
      color: 'verde'
    },
    {
      titulo: 'Estadísticas',
      descripcion: 'Analiza el rendimiento del equipo',
      icono: '📊',
      ruta: '/estadisticas',
      color: 'naranja'
    }
  ];

  const estadisticasRapidas = [
    { label: 'Jugadores Activos', valor: '12', icono: '👤' },
    { label: 'Entrenamientos', valor: '8', icono: '🏋️' },
    { label: 'Próximos Eventos', valor: '3', icono: '📅' }
  ];

  return (
    <div className="inicio-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-titulo">
            Bienvenido a <span className="texto-destacado">SportHub</span>
          </h1>
          <p className="hero-subtitulo">
            {estaAutenticado ? 
              `¡Hola ${usuario?.username || 'Usuario'}! Gestiona tu equipo eSports de manera profesional` :
              'La plataforma definitiva para la gestión de equipos eSports profesionales'
            }
          </p>
          
          {!estaAutenticado && (
            <div className="hero-botones">
              <button 
                className="btn btn-primario btn-grande"
                onClick={() => navegarA('/registro')}
              >
                Comenzar Ahora
              </button>
              <button 
                className="btn btn-secundario btn-grande"
                onClick={() => navegarA('/iniciar-sesion')}
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
        
        <div className="hero-imagen">
          <div className="icono-gaming">🎮</div>
        </div>
      </section>

      {estaAutenticado && (
        <>
          {/* Estadísticas Rápidas */}
          <section className="estadisticas-section">
            <h2>Resumen Rápido</h2>
            <div className="estadisticas-grid">
              {estadisticasRapidas.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icono">{stat.icono}</div>
                  <div className="stat-info">
                    <div className="stat-valor">{stat.valor}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Navegación Rápida */}
          <section className="navegacion-section">
            <h2>Acceso Rápido</h2>
            <div className="tarjetas-grid">
              {tarjetasNavegacion.map((tarjeta, index) => (
                <div 
                  key={index} 
                  className={`tarjeta-navegacion tarjeta-${tarjeta.color}`}
                  onClick={() => navegarA(tarjeta.ruta)}
                >
                  <div className="tarjeta-icono">{tarjeta.icono}</div>
                  <h3 className="tarjeta-titulo">{tarjeta.titulo}</h3>
                  <p className="tarjeta-descripcion">{tarjeta.descripcion}</p>
                  <div className="tarjeta-arrow">→</div>
                </div>
              ))}
            </div>
          </section>

          {/* Actividad Reciente */}
          <section className="actividad-section">
            <h2>Actividad Reciente</h2>
            <div className="actividad-lista">
              <div className="actividad-item">
                <div className="actividad-icono">➕</div>
                <div className="actividad-contenido">
                  <div className="actividad-titulo">Nuevo jugador agregado</div>
                  <div className="actividad-tiempo">Hace 2 horas</div>
                </div>
              </div>
              <div className="actividad-item">
                <div className="actividad-icono">📅</div>
                <div className="actividad-contenido">
                  <div className="actividad-titulo">Entrenamiento programado</div>
                  <div className="actividad-tiempo">Hace 5 horas</div>
                </div>
              </div>
              <div className="actividad-item">
                <div className="actividad-icono">🏆</div>
                <div className="actividad-contenido">
                  <div className="actividad-titulo">Torneo completado</div>
                  <div className="actividad-tiempo">Hace 1 día</div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Características */}
      <section className="caracteristicas-section">
        <h2>¿Por qué elegir SportHub?</h2>
        <div className="caracteristicas-grid">
          <div className="caracteristica">
            <div className="caracteristica-icono">⚡</div>
            <h3>Rápido y Eficiente</h3>
            <p>Gestiona tu equipo de manera ágil y profesional</p>
          </div>
          <div className="caracteristica">
            <div className="caracteristica-icono">📊</div>
            <h3>Análisis Detallado</h3>
            <p>Obtén estadísticas precisas del rendimiento</p>
          </div>
          <div className="caracteristica">
            <div className="caracteristica-icono">🔒</div>
            <h3>Seguro y Confiable</h3>
            <p>Tus datos están protegidos con la mejor seguridad</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio; 