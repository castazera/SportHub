import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotificaciones } from '../../contexto/ContextoNotificaciones';
import './Registro.scss';

const Registro = () => {
  const { registrarUsuario, cargando } = useAuth();
  const { mostrarNotificacion } = useNotificaciones();
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: ''
  });
  const [errores, setErrores] = useState({});
  const [errorBackend, setErrorBackend] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.name.trim()) nuevosErrores.name = 'El nombre es obligatorio.';
    if (!form.lastname.trim()) nuevosErrores.lastname = 'El apellido es obligatorio.';
    if (!form.username.trim()) nuevosErrores.username = 'El username es obligatorio.';
    if (!form.email.trim()) nuevosErrores.email = 'El email es obligatorio.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) nuevosErrores.email = 'El email no es válido.';
    if (!form.password) nuevosErrores.password = 'La contraseña es obligatoria.';
    else if (form.password.length < 6) nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
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
    setMensajeExito('');
    
    try {
      await registrarUsuario(form);
      setMensajeExito('¡Registro exitoso! Ahora puedes iniciar sesión.');
      mostrarNotificacion('Usuario registrado exitosamente', 'success');
      setTimeout(() => navigate('/iniciar-sesion'), 2000);
    } catch (error) {
      console.error('Error en registro:', error);
      

      if (error.response && error.response.data) {
        const { error: mensaje, field } = error.response.data;
        
        if (field === 'email') {
          setErrores({ email: mensaje });
        } else if (field === 'username') {
          setErrores({ username: mensaje });
        } else {
          setErrorBackend(mensaje || 'Error al registrar usuario');
        }
      } else {
        setErrorBackend(error.message || 'Error al registrar usuario');
      }
    }
  };

  return (
    <div className="contenedor fade-in">
      <div className="form-registro">
        <h2>Registro</h2>
        
        {mensajeExito && (
          <div className="mensaje-exito">
            {mensajeExito}
          </div>
        )}

        {errorBackend && (
          <div className="error-mensaje">
            {errorBackend}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label htmlFor="name">Nombre *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={form.name} 
              onChange={handleInputChange} 
              className={errores.name ? 'error' : ''} 
              disabled={cargando}
              placeholder="Tu nombre"
            />
            {errores.name && <span className="error-texto">{errores.name}</span>}
          </div>

          <div className="form-grupo">
            <label htmlFor="lastname">Apellido *</label>
            <input 
              type="text" 
              id="lastname" 
              name="lastname" 
              value={form.lastname} 
              onChange={handleInputChange} 
              className={errores.lastname ? 'error' : ''} 
              disabled={cargando}
              placeholder="Tu apellido"
            />
            {errores.lastname && <span className="error-texto">{errores.lastname}</span>}
          </div>

          <div className="form-grupo">
            <label htmlFor="username">Username *</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={form.username} 
              onChange={handleInputChange} 
              className={errores.username ? 'error' : ''} 
              disabled={cargando}
              placeholder="Nombre de usuario único"
            />
            {errores.username && <span className="error-texto">{errores.username}</span>}
          </div>

          <div className="form-grupo">
            <label htmlFor="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={form.email} 
              onChange={handleInputChange} 
              className={errores.email ? 'error' : ''} 
              disabled={cargando}
              placeholder="tu@email.com"
            />
            {errores.email && <span className="error-texto">{errores.email}</span>}
          </div>

          <div className="form-grupo">
            <label htmlFor="password">Contraseña *</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={form.password} 
              onChange={handleInputChange} 
              className={errores.password ? 'error' : ''} 
              disabled={cargando}
              placeholder="Mínimo 6 caracteres"
            />
            {errores.password && <span className="error-texto">{errores.password}</span>}
          </div>

          <button 
            className="btn btn-primario" 
            type="submit" 
            disabled={cargando}
          >
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mensaje-info">
          ¿Ya tienes cuenta? 
          <a href="/iniciar-sesion"> Inicia sesión aquí</a>
        </div>
      </div>
    </div>
  );
};

export default Registro; 