import express from 'express';
import { crearEntrenamiento, obtenerEntrenamientos, obtenerEntrenamientoPorId, actualizarEntrenamiento, eliminarEntrenamiento, obtenerEntrenamientosPorTipo, obtenerEntrenamientosPorJugador } from '../controllers/entrenamientoController.js';
import { validateBody, entrenamientoSchema } from '../validation/validation.js';

const router = express.Router();

router.post('/', validateBody(entrenamientoSchema), crearEntrenamiento);
router.get('/', obtenerEntrenamientos);
router.get('/:id', obtenerEntrenamientoPorId);
router.get('/tipo/:tipo', obtenerEntrenamientosPorTipo);
router.get('/jugador/:jugadorId', obtenerEntrenamientosPorJugador);
router.put('/:id', validateBody(entrenamientoSchema), actualizarEntrenamiento);
router.delete('/:id', eliminarEntrenamiento);

export default router;