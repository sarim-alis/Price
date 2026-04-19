import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    email:         { type: String, required: true, unique: true, lowercase: true },
    password:      { type: String, required: true },
    role:          { type: String, enum: ["buyer", "seller", "admin"], default: "buyer", index: true },
    phone:         { type: String },
    profileImage:  { type: String },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
  }, { timestamps: true }
);

export default mongoose.model("User", userSchema);