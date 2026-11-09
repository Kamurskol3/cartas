import "dotenv/config";
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import rateLimit from 'express-rate-limit';
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./lib/db.js";
import job from './lib/cron.js';

const app = express();
const PORT = process.env.PORT || 3000;

job.start();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const authLimiter = rateLimit({ //limitador pra login
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, //limite de 5 tentativas por IP
  message: 'Muitas tentativas de login. Tente novamente mais tarde.'
});

app.use(express.json({ limit: "10mb" })); // aumentei o limite para aceitar imagens em base64

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use(helmet())
app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
    connectDB();
});