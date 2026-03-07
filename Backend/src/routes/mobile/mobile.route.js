import { Router } from "express";
import { createMobile, getAllMobiles, getMobileById, getMobilesBySeller, updateMobile, deleteMobile, searchMobiles, getPricePrediction } from "../../controller/mobile/mobile.controller.js";
import { auth, isSeller } from "../../middleware/auth.js";
const router = Router();

// Public routes.
router.get("/", getAllMobiles);
router.get("/search", searchMobiles);
router.get("/:id/prediction", getPricePrediction);
router.get("/:id", getMobileById);

// Protected routes.
router.post("/", auth, isSeller, createMobile);
router.get("/seller/my-listings", auth, isSeller, getMobilesBySeller);
router.get("/seller/:sellerId", getMobilesBySeller);
router.put("/:id", auth, isSeller, updateMobile);
router.delete("/:id", auth, isSeller, deleteMobile);

export default router;
