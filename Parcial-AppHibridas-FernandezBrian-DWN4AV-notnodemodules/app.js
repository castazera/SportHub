import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import jugadoresRoutes from './src/routes/jugadoresRoutes.js';
import entrenamientosRoutes from './src/routes/entrenamientosRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

dotenv.config()

const app = express()

app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("conexion con mongo exitosa"))
.catch((err) => console.log("conexion fallida", err))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/user', userRoutes);
app.use('/api/jugadores', jugadoresRoutes);
app.use('/api/entrenamientos', entrenamientosRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(3000, ()=>{
    console.log("api running")
})

export default app;

