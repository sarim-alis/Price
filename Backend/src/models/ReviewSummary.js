import mongoose from "mongoose";

const reviewSummarySchema = new mongoose.Schema(
  {
    mobileId: { type: mongoose.Schema.Types.ObjectId, ref: "Mobile", required: true, unique: true },
    summary:  { type: String, required: true },
    model:    { type: String, default: "huggingface" }
  }, { timestamps: true }
);

export default mongoose.model("ReviewSummary", reviewSummarySchema);