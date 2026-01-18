import { Router } from "express";
import { register, login, getProfile, updateProfile, changePassword, getAllUsers, deleteUser } from "../../controller/user/user.controller.js";
import { auth, isAdmin } from "../../middleware/auth.js";
const router = Router();

// Public routes.
router.post("/register", register);
router.post("/login", login);

// Protected routes.
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);

// Admin routes.
router.get("/", auth, isAdmin, getAllUsers);
router.delete("/:id", auth, isAdmin, deleteUser);

export default router;
