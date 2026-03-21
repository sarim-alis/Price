import User from "../../models/User.js";
import Seller from "../../models/Seller.js";
import bcrypt from "bcryptjs";

export const createSeller = async (req, res) => {
  try {
    const { name, email, password, phone, cnic } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Check if CNIC already exists
    if (cnic) {
      const existingCnic = await Seller.findOne({ cnic });
      if (existingCnic) {
        return res.status(400).json({ message: "Seller with this CNIC already exists" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with seller role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "seller"
    });

    // Create seller profile
    const seller = await Seller.create({
      sellerId: user._id,
      cnic: cnic || undefined,
      isVerified: false,
      badge: "none",
      rating: 0,
      fraudScore: 0
    });

    res.status(201).json({
      message: "Seller created successfully",
      seller: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cnic: seller.cnic,
        isVerified: seller.isVerified,
        badge: seller.badge,
        rating: seller.rating
      }
    });
  } catch (error) {
    console.error("Error creating seller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllSellers = async (req, res) => {
  try {
    // First get all users with seller role
    const User = (await import("../../models/User.js")).default;
    const sellerUsers = await User.find({ role: "seller" })
      .select("_id name email phone createdAt")
      .sort({ createdAt: -1 });

    // Then get seller profiles for these users
    const sellerIds = sellerUsers.map(user => user._id);
    const sellerProfiles = await Seller.find({ sellerId: { $in: sellerIds } })
      .populate("sellerId", "name email phone createdAt")
      .sort({ createdAt: -1 });

    const sellersData = sellerProfiles.map(seller => ({
      id: seller._id,
      userId: seller.sellerId._id,
      name: seller.sellerId.name,
      email: seller.sellerId.email,
      phone: seller.sellerId.phone,
      cnic: seller.cnic,
      isVerified: seller.isVerified,
      badge: seller.badge,
      rating: seller.rating,
      fraudScore: seller.fraudScore,
      createdAt: seller.createdAt
    }));

    res.status(200).json({ sellers: sellersData });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSellerById = async (req, res) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id).populate("sellerId", "name email phone createdAt");

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({
      seller: {
        id: seller._id,
        userId: seller.sellerId._id,
        name: seller.sellerId.name,
        email: seller.sellerId.email,
        phone: seller.sellerId.phone,
        cnic: seller.cnic,
        isVerified: seller.isVerified,
        badge: seller.badge,
        rating: seller.rating,
        fraudScore: seller.fraudScore,
        createdAt: seller.createdAt
      }
    });
  } catch (error) {
    console.error("Error fetching seller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
