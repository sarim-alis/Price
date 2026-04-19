import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify JWT token.
export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Check if phone is verified (for protected actions).
export const requirePhoneVerified = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.phoneVerified) {
      return res.status(403).json({ 
        message: "Phone verification required. Please verify your phone number to perform this action.",
        phoneVerified: false 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user is seller.
export const isSeller = (req, res, next) => {
  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Seller access required" });
  }
  next();
};

// Check if user is admin.
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
