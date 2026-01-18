import Mobile from "../../models/Mobile.js";

// Create mobile.
export const createMobile = async (req, res) => {
  try {
    const mobile = await Mobile.create({ ...req.body, sellerId: req.user.id });
    res.status(201).json({ message: "Mobile listed", mobile });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You already have this mobile listed" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get all mobiles.
export const getAllMobiles = async (req, res) => {
  try {
    const { brand, minPrice, maxPrice, condition, status, page = 1, limit = 10 } = req.query;
    const filter = { status: "active" };
    if (brand) filter.brand = brand.toLowerCase();
    if (condition) filter.condition = condition;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const mobiles = await Mobile.find(filter)
      .populate("sellerId", "name email phone")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await Mobile.countDocuments(filter);
    res.json({ mobiles, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get mobile by id.
export const getMobileById = async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id).populate("sellerId", "name email phone");
    if (!mobile) {
      return res.status(404).json({ message: "Mobile not found" });
    }
    res.json(mobile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get mobiles by seller.
export const getMobilesBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId || req.user.id;
    const mobiles = await Mobile.find({ sellerId });
    res.json(mobiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update mobile.
export const updateMobile = async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) {
      return res.status(404).json({ message: "Mobile not found" });
    }
    if (mobile.sellerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    const updated = await Mobile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Mobile updated", mobile: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete mobile.
export const deleteMobile = async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) {
      return res.status(404).json({ message: "Mobile not found" });
    }
    if (mobile.sellerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Mobile.findByIdAndDelete(req.params.id);
    res.json({ message: "Mobile deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search mobiles.
export const searchMobiles = async (req, res) => {
  try {
    const { q } = req.query;
    const mobiles = await Mobile.find({
      status: "active",
      $or: [
        { brand: { $regex: q, $options: "i" } },
        { model: { $regex: q, $options: "i" } },
        { processor: { $regex: q, $options: "i" } }
      ]
    }).populate("sellerId", "name email phone").limit(20);
    res.json(mobiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
