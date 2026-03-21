import express from "express";
import { createSeller, getAllSellers, getSellerById } from "../../controller/seller/seller.controller.js";
import { auth, isAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Admin only routes
router.post("/create", auth, isAdmin, createSeller);
router.get("/all", auth, isAdmin, getAllSellers);
router.get("/:id", auth, isAdmin, getSellerById);

export default router;
