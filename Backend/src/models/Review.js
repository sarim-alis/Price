import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    mobileId: { type: mongoose.Schema.Types.ObjectId, ref: "Mobile", required: true, index: true },
    buyerId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating:   { type: Number, min: 1, max: 5, required: true },
    comment:  { type: String },
    source:   { type: String, enum: ["user", "youtube", "external"], default: "user" }
  }, { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);