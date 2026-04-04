import express from "express";
import { getAllBuyers, getBuyerById } from "../../controller/buyer/buyer.controller.js";
import { auth, isAdmin } from "../../middleware/auth.js";
const router = express.Router();

router.get("/all", auth, isAdmin, getAllBuyers);
router.get("/:id", auth, isAdmin, getBuyerById);

export default router;
