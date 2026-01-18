import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sellerId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mobileId:      { type: mongoose.Schema.Types.ObjectId, ref: "Mobile", required: true, index: true },
    price:         { type: Number, required: true },
    quantity:      { type: Number, default: 1 },
    status:        { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" },
    escrowStatus:  { type: String, enum: ["held", "released", "refunded", "none"], default: "none" },
    paymentMethod: { type: String, enum: ["cod", "escrow", "card"], default: "cod" }
  }, { timestamps: true }
);

export default mongoose.model("Order", orderSchema);