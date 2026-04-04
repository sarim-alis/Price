import express from "express";
import { getDashboardStats } from "../../controller/dashboard/dashboard.controller.js";
import { auth, isAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Get dashboard statistics
router.get("/stats", auth, isAdmin, getDashboardStats);

export default router;
