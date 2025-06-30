import Jwt from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config()

const claveSecreta = process.env.JWT_SECRET

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'No autorizado: falta token' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ mensaje: 'No autorizado: token inválido' });
    }
    try {
        const decoded = Jwt.verify(token, claveSecreta);
        req.usuario = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ mensaje: 'No autorizado: token inválido' });
    }
}