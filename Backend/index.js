// Imports.
import express from "express";
import dotenv from "dotenv";
import { prisma } from "./prisma/client.js";
dotenv.config();

// App.
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware.
app.use(express.json());

// Routes.
app.get("/", (req, res) => {
  res.send("Server running 🐶⭐💖");
});

// Health check.
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({  status: "healthy",  database: "connected", timestamp: new Date().toISOString()});
  } catch (error) {
    res.status(503).json({ status: "unhealthy", database: "disconnected", error: error.message });
  }
});

// Server.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} 🧝💗⭐`);
  console.log(`Database connected 🐬🔰👑`);
});
