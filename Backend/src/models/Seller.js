import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    sellerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    cnic:       { type: String, required: false, unique: true },
    document:   { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verifiedBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);