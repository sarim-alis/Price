import User from "../../models/User.js";
import Seller from "../../models/Seller.js";
import bcrypt from "bcryptjs";

export const createSeller = async (req, res) => {
  try {
    const { name, email, password, phone, cnic, shopName, sellerPic } = req.body;

    if (!name || !email || !password || !cnic || !shopName) {
      return res.status(400).json({ message: "Name, email, password, CNIC, and Shop Name are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    if (cnic) {
      const existingCnic = await Seller.findOne({ cnic });
      if (existingCnic) {
        return res.status(400).json({ message: "Seller with this CNIC already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      cnic,
      shopName,
      sellerPic
    });

    res.status(201).json({
      message: "Seller created successfully",
      seller: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cnic: seller.cnic,
        shopName: seller.shopName,
        sellerPic: seller.sellerPic
      }
    });
  } catch (error) {
    console.error("Error creating seller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllSellers = async (req, res) => {
  try {
    const sellerProfiles = await Seller.find()
      .populate("sellerId", "name email phone profileImage createdAt")
      .sort({ createdAt: -1 });

    const sellersData = sellerProfiles.map(seller => ({
      id: seller._id,
      userId: seller.sellerId._id,
      name: seller.sellerId.name,
      email: seller.sellerId.email,
      phone: seller.sellerId.phone,
      profileImage: seller.sellerId.profileImage,
      cnic: seller.cnic,
      shopName: seller.shopName,
      sellerPic: seller.sellerPic,
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

    const seller = await Seller.findById(id).populate("sellerId", "name email phone profileImage createdAt");

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
        profileImage: seller.sellerId.profileImage,
        cnic: seller.cnic,
        shopName: seller.shopName,
        sellerPic: seller.sellerPic,
        createdAt: seller.createdAt
      }
    });
  } catch (error) {
    console.error("Error fetching seller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
