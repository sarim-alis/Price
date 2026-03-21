// Imports.
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/user/user.route.js";
import mobileRoutes from "./src/routes/mobile/mobile.route.js";
import sellerRoutes from "./src/routes/seller/seller.route.js";
import { errorHandler, notFound } from "./src/middleware/errorHandler.js";
dotenv.config();

// App.
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware.
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["*"];

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? allowedOrigins : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

// Routes.
app.get("/", (req, res) => { res.send("Server running 🐶⭐💖")});
app.use("/api/users", userRoutes);
app.use("/api/mobiles", mobileRoutes);
app.use("/api/sellers", sellerRoutes);

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

app.use(notFound);
app.use(errorHandler);

// Server.
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🧝💗⭐`);
  });
};
startServer();