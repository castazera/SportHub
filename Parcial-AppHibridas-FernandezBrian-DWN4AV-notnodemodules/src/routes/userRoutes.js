import express from "express"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { authenticateJWT } from "../middlewares/autoMiddleware.js";
import User from '../models/UserModel.js';
import { validateBody } from '../validation/validation.js';

const router = express.Router()
dotenv.config()

router.post('/', async (req, res) => {
    try {
        const { name, lastname, username, email, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ 
                error: 'El email ya está registrado',
                field: 'email'
            });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ 
                error: 'El username ya está en uso',
                field: 'username'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            lastname,
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const { password: _, ...userResponse } = user.toObject();

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: userResponse
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = Jwt.sign(
            {
                id: user._id,
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                name: user.name,
                lastname: user.lastname,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.usuario.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;