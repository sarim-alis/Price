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

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Express server running with Prisma & PostgreSQL!");
});

// Health check endpoint with database connection test
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: "healthy", 
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: "unhealthy", 
      database: "disconnected",
      error: error.message 
    });
  }
});

// Get all mobiles
app.get("/api/mobiles", async (req, res) => {
  try {
    const mobiles = await prisma.mobile.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(mobiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mobile by ID
app.get("/api/mobiles/:id", async (req, res) => {
  try {
    const mobile = await prisma.mobile.findUnique({
      where: { id: req.params.id }
    });
    if (!mobile) {
      return res.status(404).json({ error: "Mobile not found" });
    }
    res.json(mobile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new mobile
app.post("/api/mobiles", async (req, res) => {
  try {
    const { brand, model, ram, storage, screenSize, camera, battery, processor, price } = req.body;
    const mobile = await prisma.mobile.create({
      data: {
        brand,
        model,
        ram: parseInt(ram),
        storage: parseInt(storage),
        screenSize: parseFloat(screenSize),
        camera: parseInt(camera),
        battery: parseInt(battery),
        processor,
        price: parseFloat(price)
      }
    });
    res.status(201).json(mobile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update mobile
app.put("/api/mobiles/:id", async (req, res) => {
  try {
    const { brand, model, ram, storage, screenSize, camera, battery, processor, price } = req.body;
    const mobile = await prisma.mobile.update({
      where: { id: req.params.id },
      data: {
        brand,
        model,
        ram: parseInt(ram),
        storage: parseInt(storage),
        screenSize: parseFloat(screenSize),
        camera: parseInt(camera),
        battery: parseInt(battery),
        processor,
        price: parseFloat(price)
      }
    });
    res.json(mobile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete mobile
app.delete("/api/mobiles/:id", async (req, res) => {
  try {
    await prisma.mobile.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Mobile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all predictions
app.get("/api/predictions", async (req, res) => {
  try {
    const predictions = await prisma.prediction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new prediction
app.post("/api/predictions", async (req, res) => {
  try {
    const { brand, model, ram, storage, screenSize, camera, battery, processor, predictedPrice } = req.body;
    const prediction = await prisma.prediction.create({
      data: {
        brand,
        model,
        ram: parseInt(ram),
        storage: parseInt(storage),
        screenSize: parseFloat(screenSize),
        camera: parseInt(camera),
        battery: parseInt(battery),
        processor,
        predictedPrice: parseFloat(predictedPrice)
      }
    });
    res.status(201).json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} 🧝💗⭐`);
  console.log(`Database connected 🐬🔰👑`);
});
