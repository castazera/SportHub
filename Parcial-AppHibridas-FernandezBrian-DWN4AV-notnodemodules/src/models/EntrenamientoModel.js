// models/Entrenamiento.js
import mongoose from 'mongoose';

const entrenamientoSchema = new mongoose.Schema({
  jugadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jugador',
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Aim Training', 'Game Sense', 'Team Coordination', 'Strategy', 'Physical', 'Mental']
  },
  fecha: {
    type: Date,
    required: true
  },
  duracion: {
    type: Number,
    required: true,
    min: 1,
    max: 480
  },
  descripcion: {
    type: String,
    default: ''
  },
  objetivos: {
    type: String,
    default: ''
  },
  notas: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

entrenamientoSchema.index({ jugadorId: 1, fecha: -1 });
entrenamientoSchema.index({ tipo: 1 });

export default mongoose.model('Entrenamiento', entrenamientoSchema);