import React, { useState, useEffect } from 'react';
import { useServicios } from '../../hooks/useServicios';
import Loading from '../../componentes/Loading/Loading';
import Error from '../../componentes/Error/Error';
import './Jugadores.scss';

const Jugadores = () => {
  const { 
    obtenerJugadores, 
    crearJugador, 
    actualizarJugador, 
    eliminarJugador, 
    cargando, 
    error, 
    limpiarError 
  } = useServicios();
  
  const [listaJugadores, setListaJugadores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [nuevoJugador, setNuevoJugador] = useState({
    name: '',
    nickname: '',
    edad: '',
    juego: '',
    nivel: 'amateur',
    email: ''
  });
  const [errores, setErrores] = useState({});
  const [filtros, setFiltros] = useState({
    page: 1,
    limit: 10,
    order: 'asc'
  });
  const [busqueda, setBusqueda] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('');
  const [filtroJuego, setFiltroJuego] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalJugadores, setTotalJugadores] = useState(0);

  useEffect(() => {
    cargarJugadores();
  }, [filtros, busqueda, filtroNivel, filtroJuego]);

  const cargarJugadores = async () => {
    try {
      limpiarError();
      const respuesta = await obtenerJugadores(filtros.page, filtros.limit, filtros.order);
      console.log('Respuesta backend jugadores:', respuesta);
      
      if (respuesta.jugadores) {
        setListaJugadores(respuesta.jugadores);
        setTotalPaginas(respuesta.totalPages || 1);
        setTotalJugadores(respuesta.total || respuesta.jugadores.length);
      } else if (Array.isArray(respuesta)) {
        setListaJugadores(respuesta);
        setTotalJugadores(respuesta.length);
      } else {
        setListaJugadores([]);
        setTotalJugadores(0);
      }
    } catch (error) {
      console.error('Error al cargar jugadores:', error);
    }
  };

  const cambiarOrden = () => {
    setFiltros(prev => ({
      ...prev,
      order: prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const cambiarPagina = (nuevaPagina) => {
    setFiltros(prev => ({
      ...prev,
      page: nuevaPagina
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoJugador(prev => ({ ...prev, [name]: value }));
    setErrores(prev => ({ ...prev, [name]: undefined }));
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setFiltros(prev => ({ ...prev, page: 1 }));
  };

  const handleFiltroNivelChange = (e) => {
    setFiltroNivel(e.target.value);
    setFiltros(prev => ({ ...prev, page: 1 }));
  };

  const handleFiltroJuegoChange = (e) => {
    setFiltroJuego(e.target.value);
    setFiltros(prev => ({ ...prev, page: 1 }));
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroNivel('');
    setFiltroJuego('');
    setFiltros(prev => ({ ...prev, page: 1 }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!nuevoJugador.name.trim()) nuevosErrores.name = 'El nombre es obligatorio.';
    if (!nuevoJugador.nickname.trim()) nuevosErrores.nickname = 'El nickname es obligatorio.';
    if (!nuevoJugador.edad) {
      nuevosErrores.edad = 'La edad es obligatoria.';
    } else {
      const edad = parseInt(nuevoJugador.edad);
      if (isNaN(edad) || edad < 10 || edad > 99) {
        nuevosErrores.edad = 'La edad debe estar entre 10 y 99 años.';
      }
    }
    if (!nuevoJugador.juego.trim()) nuevosErrores.juego = 'El juego es obligatorio.';
    if (!nuevoJugador.nivel || !['amateur', 'semi-pro', 'pro'].includes(nuevoJugador.nivel)) {
      nuevosErrores.nivel = 'El nivel es obligatorio.';
    }
    if (nuevoJugador.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(nuevoJugador.email)) {
      nuevosErrores.email = 'El email no es válido.';
    }
    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    limpiarError();
    setErrores({});
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    try {
      const datosJugador = {
        ...nuevoJugador,
        edad: parseInt(nuevoJugador.edad)
      };
      if (!datosJugador.email) {
        delete datosJugador.email;
      }

      if (modoEdicion) {
        await actualizarJugador(jugadorSeleccionado._id, datosJugador);
        setMensajeExito('Jugador actualizado con éxito');
      } else {
        await crearJugador(datosJugador);
        setMensajeExito('Jugador creado con éxito');
      }

      setNuevoJugador({
        name: '',
        nickname: '',
        edad: '',
        juego: '',
        nivel: 'amateur',
        email: ''
      });
      setMostrarFormulario(false);
      setModoEdicion(false);
      setJugadorSeleccionado(null);
      await cargarJugadores();
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (error) {
      let mensaje = '';
      if (error && error.message) {
        const msg = error.message.toLowerCase();
        if (msg.includes('401') || msg.includes('no token provided') || msg.includes('invalid token') || msg.includes('forbidden')) {
          mensaje = 'Debes iniciar sesión para gestionar jugadores.';
        } else if (msg.includes('datos inválidos') && error.detalles) {
          mensaje = 'Datos inválidos: ' + error.detalles.join(', ');
        } else if (msg.includes('duplicate key') || msg.includes('duplicate')) {
          mensaje = 'El nickname ya está registrado. Usa otro.';
        } else {
          mensaje = error.message;
        }
      } else {
        mensaje = 'Error desconocido al gestionar jugador.';
      }
      setErrores({ backend: mensaje });
      console.error('Error al gestionar jugador:', error);
    }
  };

  const cancelarCreacion = () => {
    setMostrarFormulario(false);
    setNuevoJugador({
      name: '',
      nickname: '',
      edad: '',
      juego: '',
      nivel: 'amateur',
      email: ''
    });
    setErrores({});
    setModoEdicion(false);
    setJugadorSeleccionado(null);
    limpiarError();
  };

  const abrirFormularioEditar = (jugador) => {
    setNuevoJugador({
      name: jugador.name || '',
      nickname: jugador.nickname || '',
      edad: jugador.edad || '',
      juego: jugador.juego || '',
      nivel: jugador.nivel || 'amateur',
      email: jugador.email || ''
    });
    setJugadorSeleccionado(jugador);
    setMostrarFormulario(true);
    setModoEdicion(true);
  };

  const manejarEliminar = (id) => {
    setIdAEliminar(id);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarJugador(idAEliminar);
      setMostrarModalEliminar(false);
      setIdAEliminar(null);
      await cargarJugadores();
      setMensajeExito('Jugador eliminado con éxito');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (error) {
      let mensaje = '';
      if (error && error.message) {
        const msg = error.message.toLowerCase();
        if (msg.includes('401') || msg.includes('no token provided') || msg.includes('invalid token') || msg.includes('forbidden')) {
          mensaje = 'Debes iniciar sesión para eliminar jugadores.';
        } else {
          mensaje = error.message;
        }
      } else {
        mensaje = 'Error desconocido al eliminar jugador.';
      }
      setErrores({ backend: mensaje });
      setMostrarModalEliminar(false);
      setIdAEliminar(null);
      console.error('Error eliminando jugador:', error);
    }
  };

  const cancelarEliminar = () => {
    setMostrarModalEliminar(false);
    setIdAEliminar(null);
  };

  const jugadoresFiltrados = listaJugadores.filter(jugador => {
    const cumpleBusqueda = !busqueda || 
      (jugador.name || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      jugador.nickname.toLowerCase().includes(busqueda.toLowerCase()) ||
      jugador.juego.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleNivel = !filtroNivel || jugador.nivel === filtroNivel;
    const cumpleJuego = !filtroJuego || jugador.juego.toLowerCase().includes(filtroJuego.toLowerCase());

    return cumpleBusqueda && cumpleNivel && cumpleJuego;
  });

  if (cargando && listaJugadores.length === 0) {
    return <Loading mensaje="Cargando jugadores..." />;
  }

  return (
    <div className="contenedor fade-in">
      {mensajeExito && (
        <div className="mensaje-exito">
          {mensajeExito}
        </div>
      )}

      <div className="jugadores-header">
        <h2>Gestión de Jugadores</h2>
        <div className="controles">
          <button 
            className="btn btn-primario"
            onClick={() => setMostrarFormulario((prev) => !prev)}
          >
            {mostrarFormulario ? 'Cancelar' : '+ Nuevo Jugador'}
          </button>
          <button 
            className="btn btn-secundario" 
            onClick={cambiarOrden}
          >
            Ordenar: {filtros.order === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
          <button 
            className="btn btn-secundario" 
            onClick={cargarJugadores}
            disabled={cargando}
          >
            {cargando ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      <div className="filtros-container">
        <div className="filtros-grupo">
          <input
            type="text"
            placeholder="Buscar por nombre, nickname o juego..."
            value={busqueda}
            onChange={handleBusquedaChange}
            className="busqueda-input"
          />
          
          <select
            value={filtroNivel}
            onChange={handleFiltroNivelChange}
            className="filtro-select"
          >
            <option value="">Todos los niveles</option>
            <option value="amateur">Amateur</option>
            <option value="semi-pro">Semi-Pro</option>
            <option value="pro">Pro</option>
          </select>

          <input
            type="text"
            placeholder="Filtrar por juego..."
            value={filtroJuego}
            onChange={handleFiltroJuegoChange}
            className="filtro-input"
          />

          <button 
            className="btn btn-tertiary"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>

        <div className="info-resultados">
          {jugadoresFiltrados.length} de {totalJugadores} jugador{totalJugadores !== 1 ? 'es' : ''}
        </div>
      </div>

      {mostrarFormulario && (
        <div className="formulario-crear">
          <h3>{modoEdicion ? 'Editar Jugador' : 'Nuevo Jugador'}</h3>
          <form onSubmit={handleSubmit} className="formulario">
            <div className="formulario-grupo">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={nuevoJugador.name}
                onChange={handleInputChange}
                className={errores.name ? 'error' : ''}
                placeholder="Nombre completo"
              />
              {errores.name && <span className="error-texto">{errores.name}</span>}
            </div>

            <div className="formulario-grupo">
              <label htmlFor="nickname">Nickname *</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={nuevoJugador.nickname}
                onChange={handleInputChange}
                className={errores.nickname ? 'error' : ''}
                placeholder="Nombre de usuario en el juego"
              />
              {errores.nickname && <span className="error-texto">{errores.nickname}</span>}
            </div>

            <div className="formulario-grupo">
              <label htmlFor="edad">Edad *</label>
              <input
                type="number"
                id="edad"
                name="edad"
                value={nuevoJugador.edad}
                onChange={handleInputChange}
                className={errores.edad ? 'error' : ''}
                min="10"
                max="99"
                placeholder="Edad entre 10 y 99"
              />
              {errores.edad && <span className="error-texto">{errores.edad}</span>}
            </div>

            <div className="formulario-grupo">
              <label htmlFor="juego">Juego Principal *</label>
              <input
                type="text"
                id="juego"
                name="juego"
                value={nuevoJugador.juego}
                onChange={handleInputChange}
                className={errores.juego ? 'error' : ''}
                placeholder="Ej: League of Legends, Valorant, CS:GO"
              />
              {errores.juego && <span className="error-texto">{errores.juego}</span>}
            </div>

            <div className="formulario-grupo">
              <label htmlFor="nivel">Nivel *</label>
              <select
                id="nivel"
                name="nivel"
                value={nuevoJugador.nivel}
                onChange={handleInputChange}
                className={errores.nivel ? 'error' : ''}
              >
                <option value="">Selecciona un nivel</option>
                <option value="amateur">Amateur</option>
                <option value="semi-pro">Semi-Pro</option>
                <option value="pro">Pro</option>
              </select>
              {errores.nivel && <span className="error-texto">{errores.nivel}</span>}
            </div>

            <div className="formulario-grupo">
              <label htmlFor="email">Email (opcional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={nuevoJugador.email}
                onChange={handleInputChange}
                className={errores.email ? 'error' : ''}
                placeholder="email@ejemplo.com"
              />
              {errores.email && <span className="error-texto">{errores.email}</span>}
            </div>

            <div className="formulario-acciones">
              <button 
                type="button" 
                className="btn btn-secundario"
                onClick={cancelarCreacion}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primario"
                disabled={cargando}
              >
                {cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Jugador')}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="error-mensaje">
          <p>{error}</p>
        </div>
      )}

      {errores.backend && (
        <div className="error-mensaje">
          <p>{errores.backend}</p>
        </div>
      )}

      <div className="jugadores-lista">
        {jugadoresFiltrados.length === 0 ? (
          <div className="jugadores-vacio">
            <p>
              {busqueda || filtroNivel || filtroJuego 
                ? 'No se encontraron jugadores con los filtros aplicados' 
                : 'No hay jugadores registrados'
              }
            </p>
          </div>
        ) : (
          jugadoresFiltrados.map(jugador => (
            <div key={jugador._id} className="jugador-card">
              <div className="jugador-info">
                <h3>{jugador.name}</h3>
                <p className="nickname">@{jugador.nickname}</p>
                <p><strong>Edad:</strong> {jugador.edad} años</p>
                <p><strong>Juego:</strong> {jugador.juego}</p>
                <p><strong>Nivel:</strong> 
                  <span className={`nivel-badge nivel-${jugador.nivel}`}>
                    {jugador.nivel}
                  </span>
                </p>
                {jugador.email && <p><strong>Email:</strong> {jugador.email}</p>}
              </div>
              <div className="jugador-acciones">
                <button 
                  className="btn btn-edit"
                  onClick={() => abrirFormularioEditar(jugador)}
                  title="Editar jugador"
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => manejarEliminar(jugador._id)}
                  title="Eliminar jugador"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="paginacion">
          <button 
            className="btn btn-paginacion"
            onClick={() => cambiarPagina(filtros.page - 1)}
            disabled={filtros.page === 1}
          >
            ← Anterior
          </button>
          
          <div className="paginas-numeros">
            {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPaginas - 4, filtros.page - 2)) + i;
              return (
                <button
                  key={pageNum}
                  className={`btn btn-pagina ${filtros.page === pageNum ? 'activa' : ''}`}
                  onClick={() => cambiarPagina(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button 
            className="btn btn-paginacion"
            onClick={() => cambiarPagina(filtros.page + 1)}
            disabled={filtros.page === totalPaginas}
          >
            Siguiente →
          </button>
        </div>
      )}

      {mostrarModalEliminar && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>¿Eliminar jugador?</h3>
            <p>Esta acción <strong>no se puede deshacer</strong>.<br/>¿Estás seguro de que quieres eliminar este jugador?</p>
            <div className="modal-acciones">
              <button className="btn btn-secundario" onClick={cancelarEliminar}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmarEliminar}>Eliminar definitivamente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jugadores; 