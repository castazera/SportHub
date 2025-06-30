import express from 'express';
import { crearJugador, obtenerJugadores, obtenerJugadorPorId, actualizarJugador, eliminarJugador, obtenerJugadorPorNickname, obtenerJugadorPorNombre } from '../controllers/jugadorController.js';
import { validateBody, jugadorSchema } from '../validation/validation.js';

const router = express.Router();

router.post('/', validateBody(jugadorSchema), crearJugador);
router.get('/', obtenerJugadores);
router.get('/:id', obtenerJugadorPorId);
router.get('/nickname/:nickname', obtenerJugadorPorNickname);
router.get('/nombre/:nombre', obtenerJugadorPorNombre);
router.put('/:id', validateBody(jugadorSchema), actualizarJugador);
router.delete('/:id', eliminarJugador);

export default router;