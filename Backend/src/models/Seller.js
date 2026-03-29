import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    sellerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    cnic:       { type: String, required: true, unique: true },
    shopName:   { type: String, required: true, trim: true },
    sellerPic:  { type: String },
  }, { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);