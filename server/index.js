import express from 'express';
import "dotenv/config";
import { db } from "./config/db.js";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 8000;

// Konfigurasi middleware CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL, // URL klien yang diperbolehkan
    credentials: true,             // Izinkan pengiriman cookie lintas domain
  })
);

// Middleware untuk menangani JSON
app.use(express.json());
app.use(cookieParser())

// Middleware untuk logging request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Rute utama untuk pengecekan server
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

// Rute untuk User API
app.use('/api/v1/users', userRouter);

// Rute untuk Auth API
app.use('/api/v1/auth', authRouter); // Diperbaiki path dari './api/v1/auth' ke '/api/v1/auth'

// Menangani rute yang tidak ditemukan
app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Memulai server
app.listen(PORT, () => {
  console.log(`Server started, listening on port ${PORT}`);
});
