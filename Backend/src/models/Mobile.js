import mongoose from "mongoose";

const mobileSchema = new mongoose.Schema(
  {
    sellerId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    brand:       { type: String, required: true, index: true, lowercase: true },
    model:       { type: String, required: true },
    ram:         { type: Number, required: true },
    storage:     { type: Number, required: true },
    screenSize:  { type: Number, required: true },
    frontCamera: { type: Number, required: true },
    rearCamera:  { type: Number, required: true },
    battery:     { type: Number, required: true },
    processor:   { type: String, required: true },
    price:       { type: Number, required: true, index: true },
    stock:       { type: Number, default: 1 },
    status:      { type: String, enum: ["active", "inactive", "sold"], default: "active", index: true },
    condition:   { type: String, enum: ["new", "used", "refurbished"], default: "used" },
    location:    { type: String },
    images:      [{ type: String }]
  }, { timestamps: true }
);

mobileSchema.index({ sellerId: 1, brand: 1, model: 1, ram: 1, storage: 1 }, { unique: true });
export default mongoose.model("Mobile", mobileSchema);