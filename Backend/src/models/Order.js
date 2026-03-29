import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber:      { type: String, unique: true },
    buyerId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sellerId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mobileId:         { type: mongoose.Schema.Types.ObjectId, ref: "Mobile", required: true, index: true },
    price:            { type: Number, required: true },
    quantity:         { type: Number, default: 1 },
    status:           { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending", index: true },
    paymentMethod:    { type: String, enum: ["jazzcash", "easypaisa", "bank_transfer"], required: true },
    paymentStatus:    { type: String, enum: ["pending", "confirmed", "failed"], default: "pending", index: true },
    paymentProofUrl:  { type: String },
    paymentConfirmedAt: { type: Date },
    sellerPaymentInfo: {
      jazzcashNumber: { type: String },
      easypaisaNumber: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      accountTitle: { type: String }
    }
  }, { timestamps: true }
);

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model("Order", orderSchema);