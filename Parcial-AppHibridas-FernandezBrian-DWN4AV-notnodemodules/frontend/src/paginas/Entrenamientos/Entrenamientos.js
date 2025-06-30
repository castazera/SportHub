import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useApi } from "../../hooks/useApi";
import { useNotificaciones } from "../../contexto/ContextoNotificaciones";
import Loading from "../../componentes/Loading/Loading";
import "./Entrenamientos.scss";

const Entrenamientos = () => {
  const { usuario } = useAuth();
  const { mostrarNotificacion } = useNotificaciones();
  const { get, post, put, del, cargando, error, limpiarError } = useApi();

  const [entrenamientos, setEntrenamientos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [entrenamientoEditando, setEntrenamientoEditando] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [entrenamientoAEliminar, setEntrenamientoAEliminar] = useState(null);
  const [filtros, setFiltros] = useState({
    busqueda: "",
    tipo: "",
    jugador: "",
    page: 1,
  });

  const [formData, setFormData] = useState({
    jugadorId: "",
    tipo: "",
    fecha: "",
    duracion: "",
    descripcion: "",
    objetivos: "",
    notas: "",
  });

  const tiposEntrenamiento = [
    "Aim Training",
    "Game Sense",
    "Team Coordination",
    "Strategy",
    "Physical",
    "Mental",
  ];


  const cargarDatos = useCallback(async () => {
    try {
      limpiarError();

      const [entrenamientosResponse, jugadoresResponse] = await Promise.all([
        get("/api/entrenamientos"),
        get("/api/jugadores"),
      ]);


      if (entrenamientosResponse) {
        const entrenamientosData =
          entrenamientosResponse.entrenamientos || entrenamientosResponse;
        setEntrenamientos(
          Array.isArray(entrenamientosData) ? entrenamientosData : []
        );
      }


      if (jugadoresResponse) {
        const jugadoresData =
          jugadoresResponse.jugadores || jugadoresResponse;
        setJugadores(Array.isArray(jugadoresData) ? jugadoresData : []);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      mostrarNotificacion("Error al cargar los datos", "error");
    }
  }, [get, limpiarError, mostrarNotificacion]);

  useEffect(() => {
    if (!usuario) {
      setMostrarFormulario(false);
      setEntrenamientoEditando(null);
      return;
    }
    cargarDatos();
  }, [usuario, filtros, cargarDatos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const validarFormulario = () => {
    if (!formData.jugadorId.trim()) {
      mostrarNotificacion("Debes seleccionar un jugador", "error");
      return false;
    }
    if (!formData.tipo.trim()) {
      mostrarNotificacion("El tipo de entrenamiento es obligatorio", "error");
      return false;
    }
    if (!formData.fecha.trim()) {
      mostrarNotificacion("La fecha es obligatoria", "error");
      return false;
    }
    if (
      !formData.duracion ||
      formData.duracion < 5 ||
      formData.duracion > 480
    ) {
      mostrarNotificacion(
        "La duración debe estar entre 5 y 480 minutos",
        "error"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      const datosEntrenamiento = {
        ...formData,
        duracion: parseInt(formData.duracion),
      };

      if (entrenamientoEditando) {
        await put(
          `/api/entrenamientos/${entrenamientoEditando._id}`,
          datosEntrenamiento
        );
        mostrarNotificacion(
          "Entrenamiento actualizado exitosamente",
          "success"
        );
      } else {
        await post("/api/entrenamientos", datosEntrenamiento);
        mostrarNotificacion("Entrenamiento creado exitosamente", "success");
      }

      resetFormulario();
      await cargarDatos();
    } catch (error) {
      console.error("Error al guardar entrenamiento:", error);
      mostrarNotificacion(
        error.message || "Error al guardar el entrenamiento",
        "error"
      );
    }
  };

  const resetFormulario = () => {
    setFormData({
      jugadorId: "",
      tipo: "",
      fecha: "",
      duracion: "",
      descripcion: "",
      objetivos: "",
      notas: "",
    });
    setMostrarFormulario(false);
    setEntrenamientoEditando(null);
  };

  const abrirFormulario = () => {
    resetFormulario();
    setMostrarFormulario(true);
  };

  const editarEntrenamiento = (entrenamiento) => {
    setEntrenamientoEditando(entrenamiento);
    setFormData({
      jugadorId:
        typeof entrenamiento.jugadorId === "object"
          ? entrenamiento.jugadorId._id
          : entrenamiento.jugadorId || "",
      tipo: entrenamiento.tipo || "",
      fecha: entrenamiento.fecha
        ? new Date(entrenamiento.fecha).toISOString().split("T")[0]
        : "",
      duracion: entrenamiento.duracion || "",
      descripcion: entrenamiento.descripcion || "",
      objetivos: entrenamiento.objetivos || "",
      notas: entrenamiento.notas || "",
    });
    setMostrarFormulario(true);
  };

  const abrirModalEliminar = (entrenamiento) => {
    setEntrenamientoAEliminar(entrenamiento);
    setMostrarModalEliminar(true);
  };

  const cerrarModalEliminar = () => {
    setMostrarModalEliminar(false);
    setEntrenamientoAEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!entrenamientoAEliminar) return;

    try {
      await del(`/api/entrenamientos/${entrenamientoAEliminar._id}`);
      mostrarNotificacion("Entrenamiento eliminado exitosamente", "success");
      await cargarDatos();
      cerrarModalEliminar();
    } catch (error) {
      console.error("Error al eliminar entrenamiento:", error);
      mostrarNotificacion("Error al eliminar el entrenamiento", "error");
    }
  };

  const obtenerNombreJugador = (jugadorId) => {
    if (typeof jugadorId === "object" && jugadorId !== null) {
      return (
        jugadorId.name ||
        jugadorId.nombre ||
        jugadorId.nickname ||
        "Jugador desconocido"
      );
    }

    if (typeof jugadorId === "string") {
      const jugador = jugadores.find((j) => j._id === jugadorId);
      return (
        jugador?.name ||
        jugador?.nombre ||
        jugador?.nickname ||
        "Jugador desconocido"
      );
    }

    return "Jugador desconocido";
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString();
  };

  const entrenamientosFiltrados = entrenamientos.filter((entrenamiento) => {
    const cumpleBusqueda =
      !filtros.busqueda ||
      entrenamiento.tipo
        ?.toLowerCase()
        .includes(filtros.busqueda.toLowerCase()) ||
      entrenamiento.descripcion
        ?.toLowerCase()
        .includes(filtros.busqueda.toLowerCase()) ||
      obtenerNombreJugador(entrenamiento.jugadorId)
        .toLowerCase()
        .includes(filtros.busqueda.toLowerCase());

    const cumpleTipo = !filtros.tipo || entrenamiento.tipo === filtros.tipo;
    const cumpleJugador =
      !filtros.jugador ||
      entrenamiento.jugadorId === filtros.jugador ||
      (typeof entrenamiento.jugadorId === "object" &&
        entrenamiento.jugadorId?._id === filtros.jugador);

    return cumpleBusqueda && cumpleTipo && cumpleJugador;
  });

  if (cargando) {
    return <Loading mensaje="Cargando entrenamientos..." />;
  }

  return (
    <div className="contenedor fade-in">
      <div className="entrenamientos-header">
        <h2>Gestión de Entrenamientos</h2>
        <div className="controles">
          <button
            className="btn btn-primario"
            onClick={abrirFormulario}
            disabled={cargando}
          >
            + Nuevo Entrenamiento
          </button>
        </div>
      </div>

      <div className="filtros-container">
        <div className="filtros-grupo">
          <input
            type="text"
            placeholder="Buscar por tipo, descripción o jugador..."
            value={filtros.busqueda}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))
            }
            className="busqueda-input"
          />

          <select
            name="tipo"
            value={filtros.tipo}
            onChange={handleFiltroChange}
            className="filtro-select"
          >
            <option value="">Todos los tipos</option>
            {tiposEntrenamiento.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

          <select
            name="jugador"
            value={filtros.jugador}
            onChange={handleFiltroChange}
            className="filtro-select"
          >
            <option value="">Todos los jugadores</option>
            {jugadores.map((jugador) => (
              <option key={jugador._id} value={jugador._id}>
                {jugador.name || jugador.nombre} (@{jugador.nickname})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-mensaje">
          <p>Error: {error}</p>
        </div>
      )}

      {mostrarFormulario && (
        <div className="formulario-crear">
          <h3>
            {entrenamientoEditando
              ? "Editar Entrenamiento"
              : "Nuevo Entrenamiento"}
          </h3>
          <form onSubmit={handleSubmit} className="formulario">
            <div className="formulario-grupo">
              <label htmlFor="jugadorId">Jugador *</label>
              <select
                id="jugadorId"
                name="jugadorId"
                value={formData.jugadorId}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un jugador</option>
                {jugadores.map((jugador) => (
                  <option key={jugador._id} value={jugador._id}>
                    {jugador.name || jugador.nombre} (@{jugador.nickname})
                  </option>
                ))}
              </select>
            </div>

            <div className="formulario-grupo">
              <label htmlFor="tipo">Tipo de Entrenamiento *</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un tipo</option>
                {tiposEntrenamiento.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="formulario-grupo">
              <label htmlFor="fecha">Fecha *</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="formulario-grupo">
              <label htmlFor="duracion">Duración (minutos) *</label>
              <input
                type="number"
                id="duracion"
                name="duracion"
                value={formData.duracion}
                onChange={handleInputChange}
                min="5"
                max="480"
                placeholder="Duración en minutos"
                required
              />
            </div>

            <div className="formulario-grupo">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe el entrenamiento..."
                rows="3"
              />
            </div>

            <div className="formulario-grupo">
              <label htmlFor="objetivos">Objetivos</label>
              <textarea
                id="objetivos"
                name="objetivos"
                value={formData.objetivos}
                onChange={handleInputChange}
                placeholder="Objetivos del entrenamiento..."
                rows="3"
              />
            </div>

            <div className="formulario-grupo">
              <label htmlFor="notas">Notas</label>
              <textarea
                id="notas"
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                placeholder="Notas adicionales..."
                rows="3"
              />
            </div>

            <div className="formulario-acciones">
              <button
                type="button"
                className="btn btn-secundario"
                onClick={resetFormulario}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primario"
                disabled={cargando}
              >
                {cargando
                  ? "Guardando..."
                  : entrenamientoEditando
                  ? "Actualizar"
                  : "Crear Entrenamiento"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="entrenamientos-lista">
        {entrenamientosFiltrados.length === 0 ? (
          <div className="entrenamientos-vacio">
            <p>No se encontraron entrenamientos</p>
          </div>
        ) : (
          entrenamientosFiltrados.map((entrenamiento) => (
            <div key={entrenamiento._id} className="entrenamiento-card">
              <div className="entrenamiento-header">
                <h3>{entrenamiento.tipo}</h3>
                <div className="entrenamiento-meta">
                  <span className="fecha">
                    {formatearFecha(entrenamiento.fecha)}{" "}
                  </span>
                  <span className="duracion">{entrenamiento.duracion} min</span>
                </div>
              </div>

              <div className="entrenamiento-info">
                <p className="jugador">
                  <strong>Jugador:</strong>{" "}
                  {obtenerNombreJugador(entrenamiento.jugadorId)}
                </p>

                {entrenamiento.descripcion && (
                  <p className="descripcion">
                    <strong>Descripción:</strong> {entrenamiento.descripcion}
                  </p>
                )}

                {entrenamiento.objetivos && (
                  <p className="objetivos">
                    <strong>Objetivos:</strong> {entrenamiento.objetivos}
                  </p>
                )}

                {entrenamiento.notas && (
                  <p className="notas">
                    <strong>Notas:</strong> {entrenamiento.notas}
                  </p>
                )}
              </div>

              <div className="entrenamiento-acciones">
                <button
                  onClick={() => editarEntrenamiento(entrenamiento)}
                  className="btn btn-edit"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => abrirModalEliminar(entrenamiento)}
                  className="btn btn-danger"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {mostrarModalEliminar && (
        <div className="modal-overlay" onClick={cerrarModalEliminar}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar el entrenamiento de{" "}
              <strong>
                {obtenerNombreJugador(entrenamientoAEliminar?.jugadorId)}
              </strong>
              ?
            </p>
            <p>
              <strong>Tipo:</strong> {entrenamientoAEliminar?.tipo}
              <br />
              <strong>Fecha:</strong>{" "}
              {formatearFecha(entrenamientoAEliminar?.fecha)}
            </p>
            <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
              Esta acción no se puede deshacer.
            </p>

            <div className="modal-acciones">
              <button
                onClick={cerrarModalEliminar}
                className="btn btn-secundario"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="btn btn-danger"
                disabled={cargando}
              >
                {cargando ? "Eliminando..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entrenamientos;
