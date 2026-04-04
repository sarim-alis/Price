import User from "../../models/User.js";

export const getAllBuyers = async (req, res) => {
  try {
    const buyers = await User.find({ role: "buyer" })
      .select("name email phone profileImage createdAt")
      .sort({ createdAt: -1 });

    const buyersData = buyers.map(buyer => ({
      id: buyer._id,
      name: buyer.name,
      email: buyer.email,
      phone: buyer.phone,
      profileImage: buyer.profileImage,
      createdAt: buyer.createdAt
    }));

    res.status(200).json({ buyers: buyersData });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBuyerById = async (req, res) => {
  try {
    const { id } = req.params;

    const buyer = await User.findOne({ _id: id, role: "buyer" })
      .select("name email phone profileImage createdAt");

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    res.status(200).json({
      buyer: {
        id: buyer._id,
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
        profileImage: buyer.profileImage,
        createdAt: buyer.createdAt
      }
    });
  } catch (error) {
    console.error("Error fetching buyer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
