// Imports.
import User from "../../models/User.js";
import VerificationToken from "../../models/VerificationToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateVerificationToken, sendVerificationEmail } from "../../utils/emailService.js";

// Register user.
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, profileImage, cnic, shopName, shopPic, address, bankDetail, easypaisaDetail, jazzcashDetail } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (role === "seller") {
      if (!cnic) {
        return res.status(400).json({ message: "CNIC is required for sellers" });
      }

      const Seller = (await import("../../models/Seller.js")).default;
      const existingCnic = await Seller.findOne({ cnic });
      if (existingCnic) {
        return res.status(400).json({ message: "Seller with this CNIC already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role, phone, profileImage });

    if (role === "seller") {
      const Seller = (await import("../../models/Seller.js")).default;
      const sellerData = { sellerId: user._id, cnic };
      if (shopName) sellerData.shopName = shopName;
      if (shopPic) sellerData.shopPic = shopPic;
      if (address) sellerData.address = address;
      if (bankDetail) sellerData.bankDetail = bankDetail;
      if (easypaisaDetail) sellerData.easypaisaDetail = easypaisaDetail;
      if (jazzcashDetail) sellerData.jazzcashDetail = jazzcashDetail;
      
      await Seller.create(sellerData);
    }

    const verificationTokenString = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await VerificationToken.create({
      userId: user._id,
      token: verificationTokenString,
      type: "email_verification",
      expiresAt,
    });

    await sendVerificationEmail(user.email, verificationTokenString, user.name);

    res.status(201).json({ 
      message: "User registered successfully. Please check your email to verify your account.", 
      user: { id: user._id, name, email, role, phone, emailVerified: false },
      requiresVerification: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.emailVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your email before logging in.", emailVerified: false });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ 
      message: "Login successful", 
      user: { 
        id: user._id, 
        name: user.name, 
        email, 
        role: user.role
      }, 
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile.
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "seller") {
      const Seller = (await import("../../models/Seller.js")).default;
      const seller = await Seller.findOne({ sellerId: user._id });
      
      res.json({
        ...user.toObject(),
        seller: seller ? seller.toObject() : null
      });
    } else {
      res.json(user.toObject());
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile.
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage, shopName, shopPic, address, bankDetail, easypaisaDetail, jazzcashDetail } = req.body;

    const userUpdateData = {};
    if (name) userUpdateData.name = name;
    if (phone) userUpdateData.phone = phone;
    if (profileImage) userUpdateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      userUpdateData,
      { new: true }
    ).select("-password");

    if (user.role === "seller") {
      const Seller = (await import("../../models/Seller.js")).default;
      const sellerUpdateData = {};
      
      if (shopName) sellerUpdateData.shopName = shopName;
      if (shopPic) sellerUpdateData.shopPic = shopPic;
      if (address) sellerUpdateData.address = address;
      if (bankDetail) sellerUpdateData.bankDetail = bankDetail;
      if (easypaisaDetail) sellerUpdateData.easypaisaDetail = easypaisaDetail;
      if (jazzcashDetail) sellerUpdateData.jazzcashDetail = jazzcashDetail;

      if (Object.keys(sellerUpdateData).length > 0) {
        await Seller.findOneAndUpdate(
          { sellerId: user._id },
          sellerUpdateData,
          { new: true }
        );
      }
    }

    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password.
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin).
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin).
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
