import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    sellerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    cnic:       { type: String, required: false, unique: true },
    document:   { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    badge:      { type: String, enum: ["none", "verified", "trusted", "top"], default: "none" },
    rating:     { type: Number, min: 0, max: 5, default: 0 },
    fraudScore: { type: Number, min: 0, max: 100, default: 0 }
  }, { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);