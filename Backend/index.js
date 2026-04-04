// Imports.
import express from "express";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/user/user.route.js";
import mobileRoutes from "./src/routes/mobile/mobile.route.js";
import sellerRoutes from "./src/routes/seller/seller.route.js";
import buyerRoutes from "./src/routes/buyer/buyer.route.js";
import messageRoutes from "./src/routes/message/message.route.js";
import orderRoutes from "./src/routes/order/order.route.js";
import { errorHandler, notFound } from "./src/middleware/errorHandler.js";
import { initializeSocket } from "./src/config/socket.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes.
app.get("/", (req, res) => { res.send("Server running 🐶⭐💖")});
app.use("/api/users", userRoutes);
app.use("/api/mobiles", mobileRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/orders", orderRoutes);

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
const httpServer = http.createServer(app);

const startServer = async () => {
  await connectDB();
  
  // Initialize Socket.IO
  initializeSocket(httpServer);
  console.log("Socket.IO initialized ⚡");
  
  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🧝💗⭐`);
    console.log(`WebSocket server ready for real-time messaging 💬`);
  });
};
startServer();