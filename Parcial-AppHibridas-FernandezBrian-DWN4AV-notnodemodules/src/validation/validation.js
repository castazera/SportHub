import Joi from 'joi';

export const jugadorSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'El nombre es obligatorio',
    'any.required': 'El nombre es obligatorio'
  }),
  nickname: Joi.string().trim().required().messages({
    'string.empty': 'El nickname es obligatorio',
    'any.required': 'El nickname es obligatorio'
  }),
  edad: Joi.number().integer().min(10).max(99).required().messages({
    'number.base': 'La edad debe ser un número',
    'number.min': 'La edad debe ser mayor a 10 años',
    'number.max': 'La edad debe ser menor a 99 años',
    'any.required': 'La edad es obligatoria'
  }),
  juego: Joi.string().trim().required().messages({
    'string.empty': 'El juego es obligatorio',
    'any.required': 'El juego es obligatorio'
  }),
  nivel: Joi.string().valid('amateur', 'semi-pro', 'pro').required().messages({
    'any.only': 'El nivel debe ser amateur, semi-pro o pro',
    'any.required': 'El nivel es obligatorio'
  }),
  email: Joi.string().email().optional().allow('').messages({
    'string.email': 'El email debe tener un formato válido'
  }),
  createdAt: Joi.date().optional()
});

export const entrenamientoSchema = Joi.object({
  jugadorId: Joi.string().required(),
  tipo: Joi.string().valid('Aim Training', 'Game Sense', 'Team Coordination', 'Strategy', 'Physical', 'Mental').required(),
  fecha: Joi.date().required(),
  duracion: Joi.number().integer().min(1).max(480).required(),
  descripcion: Joi.string().optional().allow(''),
  objetivos: Joi.string().optional().allow(''),
  notas: Joi.string().optional().allow('')
});

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const detalles = error.details.map(d => d.message);
      return res.status(400).json({
        error: `Datos inválidos: ${detalles.join(', ')}`,
        message: 'Datos inválidos',
        detalles: detalles
      });
    }
    next();
  };
};