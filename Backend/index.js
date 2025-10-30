// Imports.
import express from "express";
import dotenv from "dotenv";
dotenv.config();

// App.
const app = express();
const PORT = 5000;

// Middleware.
app.use(express.json());
app.get("/", (req, res) => {res.send("🚀 Express server running!");});

// Server.
app.listen(PORT, () => {console.log(`Server running at http://localhost:${PORT} 🧝💗⭐`);});
