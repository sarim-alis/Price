import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    mobileId:       { type: mongoose.Schema.Types.ObjectId, ref: "Mobile", index: true },
    brand:          { type: String, required: true, lowercase: true },
    model:          { type: String, required: true },
    ram:            { type: Number, required: true },
    storage:        { type: Number, required: true },
    screenSize:     { type: Number, required: true },
    frontCamera:    { type: Number, required: true },
    rearCamera:     { type: Number, required: true },
    battery:        { type: Number, required: true },
    processor:      { type: String, required: true },
    predictedPrice: { type: Number, required: true },
    algorithm:      { type: String, enum: ["arima", "lstm", "hybrid"], default: "lstm" },
    confidence:     { type: Number, min: 0, max: 100 }
  }, { timestamps: true }
);

predictionSchema.index({ createdAt: 1 });
export default mongoose.model("Prediction", predictionSchema);
