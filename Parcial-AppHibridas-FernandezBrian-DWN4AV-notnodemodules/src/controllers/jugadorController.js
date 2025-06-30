import Jugador from '../models/JugadorModel.js';
import { obtenerJugadoresOrdenados } from '../services/jugadoresService.js';

export const crearJugador = async (req, res) => {
  try {
    const jugador = new Jugador(req.body);
    const nuevoJugador = await jugador.save();
    res.status(201).json(nuevoJugador);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'El nickname ya está en uso',
        message: 'El nickname ya está registrado por otro jugador'
      });
    }
    
    if (err.name === 'ValidationError') {
      const errores = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        error: 'Datos inválidos',
        detalles: errores
      });
    }
    
    res.status(500).json({ error: err.message });
  }
};

export const obtenerJugadores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.order || 'asc';

    const filtro = {};
    if (req.query.name) filtro.name = req.query.name;
    if (req.query.nickname) filtro.nickname = req.query.nickname;

    const resultado = await obtenerJugadoresOrdenados({ filtro, page, limit, order });

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerJugadorPorNickname = async (req, res) => {
  try {
    const jugador = await Jugador.findOne({ nickname: req.params.nickname });
    if (!jugador) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.json(jugador);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerJugadorPorNombre = async (req, res) => {
  try {
    const jugador = await Jugador.findOne({ name: req.params.nombre });
    if (!jugador) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.json(jugador);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerJugadorPorId = async (req, res) => {
  try {
    const jugador = await Jugador.findById(req.params.id);
    if (!jugador) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.json(jugador);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarJugador = async (req, res) => {
  try {
    const jugador = await Jugador.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!jugador) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.json(jugador);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'El nickname ya está en uso',
        message: 'El nickname ya está registrado por otro jugador'
      });
    }
    
    if (err.name === 'ValidationError') {
      const errores = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        error: 'Datos inválidos',
        detalles: errores
      });
    }
    
    res.status(500).json({ error: err.message });
  }
};

export const eliminarJugador = async (req, res) => {
  try {
    const jugador = await Jugador.findByIdAndDelete(req.params.id);
    if (!jugador) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.json({ message: 'Jugador eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
