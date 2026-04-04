import User from "../../models/User.js";
import Seller from "../../models/Seller.js";
import bcrypt from "bcryptjs";

export const createSeller = async (req, res) => {
  try {
    const { name, email, password, phone, cnic, shopName, shopPic, address, bankDetail, easypaisaDetail, jazzcashDetail } = req.body;

    if (!name || !email || !password || !cnic) {
      return res.status(400).json({ message: "Name, email, password, and CNIC are required" });
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

    // Create seller profile.
    const sellerData = {
      sellerId: user._id,
      cnic
    };
    
    if (shopName) sellerData.shopName = shopName;
    if (shopPic) sellerData.shopPic = shopPic;
    if (address) sellerData.address = address;
    if (bankDetail) sellerData.bankDetail = bankDetail;
    if (easypaisaDetail) sellerData.easypaisaDetail = easypaisaDetail;
    if (jazzcashDetail) sellerData.jazzcashDetail = jazzcashDetail;
    
    const seller = await Seller.create(sellerData);

    res.status(201).json({
      message: "Seller created successfully",
      seller: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cnic: seller.cnic,
        shopName: seller.shopName,
        shopPic: seller.shopPic,
        address: seller.address,
        bankDetail: seller.bankDetail,
        easypaisaDetail: seller.easypaisaDetail,
        jazzcashDetail: seller.jazzcashDetail
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

    const sellersData = sellerProfiles
      .filter(seller => seller.sellerId) // Filter out sellers with null sellerId
      .map(seller => ({
        id: seller._id,
        userId: seller.sellerId._id,
        name: seller.sellerId.name,
        email: seller.sellerId.email,
        phone: seller.sellerId.phone,
        profileImage: seller.sellerId.profileImage,
        cnic: seller.cnic,
        shopName: seller.shopName,
        shopPic: seller.shopPic,
        address: seller.address,
        bankDetail: seller.bankDetail,
        easypaisaDetail: seller.easypaisaDetail,
        jazzcashDetail: seller.jazzcashDetail,
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
        shopPic: seller.shopPic,
        address: seller.address,
        bankDetail: seller.bankDetail,
        easypaisaDetail: seller.easypaisaDetail,
        jazzcashDetail: seller.jazzcashDetail,
        createdAt: seller.createdAt
      }
    });
  } catch (error) {
    console.error("Error fetching seller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
