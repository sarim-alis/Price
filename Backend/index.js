// Imports.
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
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
    const dbState = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    if (dbState === "connected") {
      res.json({ status: "healthy", database: dbState, timestamp: new Date().toISOString() });
    } else {
      res.status(503).json({ status: "unhealthy", database: dbState });
    }
  } catch (error) {
    res.status(503).json({ status: "unhealthy", database: "disconnected", error: error.message });
  }
});

// Server.
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} 🧝💗⭐`);
  });
};

startServer();
