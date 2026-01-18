import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema(
  {
    mobileId: { type: mongoose.Schema.Types.ObjectId, ref: "Mobile", required: true, index: true },
    price:    { type: Number, required: true }
  }, { timestamps: true }
);

export default mongoose.model("PriceHistory", priceHistorySchema);