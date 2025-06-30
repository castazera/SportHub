import mongoose, {Schema} from "mongoose";


const jugadorSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    edad: {
      type: Number,
      required: true,
      min: 10,  
      max: 99
    },
    juego: {
      type: String,
      required: true,
      trim: true
    },
    nivel: {
      type: String,
      enum: ['amateur', 'semi-pro', 'pro'],
      required: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, {collection: 'jugadores'});
  
  export default mongoose.model('Jugador', jugadorSchema)