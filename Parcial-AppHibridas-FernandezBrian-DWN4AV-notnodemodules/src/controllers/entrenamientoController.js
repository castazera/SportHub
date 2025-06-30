import Entrenamiento from '../models/EntrenamientoModel.js';
import Jugador from '../models/JugadorModel.js';

export const crearEntrenamiento = async (req, res) => {
    try {
        const entrenamiento = new Entrenamiento(req.body);
        const nuevoEntrenamiento = await entrenamiento.save();
        const entrenamientoCompleto = await Entrenamiento.findById(nuevoEntrenamiento._id).populate('jugadorId');
        res.status(201).json(entrenamientoCompleto);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const obtenerEntrenamientos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'fecha';
        const sortOrder = req.query.sortOrder || 'desc';

        let sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const entrenamientos = await Entrenamiento
            .find({})
            .populate('jugadorId')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        const total = await Entrenamiento.countDocuments({});

        res.json({
            entrenamientos,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalEntrenamientos: total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const obtenerEntrenamientoPorId = async (req, res) => {
    try {
        const entrenamiento = await Entrenamiento.findById(req.params.id).populate('jugadorId');
        if (!entrenamiento) {
            return res.status(404).json({ error: 'Entrenamiento no encontrado' });
        }
        res.json(entrenamiento);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const obtenerEntrenamientosPorJugador = async (req, res) => {
    try {
        const entrenamientos = await Entrenamiento.find({ jugadorId: req.params.jugadorId }).populate('jugadorId');
        res.json(entrenamientos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const obtenerEntrenamientosPorTipo = async (req, res) => {
    try {
        const entrenamientos = await Entrenamiento.find({ tipo: req.params.tipo }).populate('jugadorId');
        res.json(entrenamientos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const actualizarEntrenamiento = async (req, res) => {
    try {
        const entrenamiento = await Entrenamiento.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        }).populate('jugadorId');
        if (!entrenamiento) {
            return res.status(404).json({ error: 'Entrenamiento no encontrado' });
        }
        res.json(entrenamiento);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const eliminarEntrenamiento = async (req, res) => {
    try {
        const entrenamiento = await Entrenamiento.findByIdAndDelete(req.params.id);
        if (!entrenamiento) {
            return res.status(404).json({ error: 'Entrenamiento no encontrado' });
        }
        res.json({ message: 'Entrenamiento eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
