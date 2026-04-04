import User from "../../models/User.js";
import Seller from "../../models/Seller.js";
import Mobile from "../../models/Mobile.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const [totalUsers, totalBuyers, totalSellers, totalMobiles] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "buyer" }),
      User.countDocuments({ role: "seller" }),
      Mobile.countDocuments()
    ]);

    // Get recent users (last 6 months data for chart)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let monthlyUsers = [];
    let monthlyMobiles = [];

    try {
      monthlyUsers = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
      ]);
    } catch (aggError) {
      console.error("Error in user aggregation:", aggError);
    }

    try {
      monthlyMobiles = await Mobile.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
      ]);
    } catch (aggError) {
      console.error("Error in mobile aggregation:", aggError);
    }

    // Get recent sellers
    let sellersData = [];
    try {
      const recentSellers = await Seller.find()
        .populate("sellerId", "name email profileImage createdAt")
        .sort({ createdAt: -1 })
        .limit(5);

      sellersData = recentSellers
        .filter(seller => seller.sellerId)
        .map(seller => ({
          id: seller._id,
          name: seller.sellerId.name,
          email: seller.sellerId.email,
          profileImage: seller.sellerId.profileImage,
          shopName: seller.shopName,
          createdAt: seller.createdAt
        }));
    } catch (sellerError) {
      console.error("Error fetching recent sellers:", sellerError);
    }

    // Get recent buyers
    let buyersData = [];
    try {
      const recentBuyers = await User.find({ role: "buyer" })
        .select("name email profileImage createdAt")
        .sort({ createdAt: -1 })
        .limit(5);

      buyersData = recentBuyers.map(buyer => ({
        id: buyer._id,
        name: buyer.name,
        email: buyer.email,
        profileImage: buyer.profileImage,
        createdAt: buyer.createdAt
      }));
    } catch (buyerError) {
      console.error("Error fetching recent buyers:", buyerError);
    }

    res.status(200).json({
      stats: {
        totalUsers,
        totalBuyers,
        totalSellers,
        totalMobiles
      },
      monthlyData: {
        users: monthlyUsers,
        mobiles: monthlyMobiles
      },
      recentSellers: sellersData,
      recentBuyers: buyersData
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};