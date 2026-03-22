import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    password:     { type: String, required: true },
    role:         { type: String, enum: ["buyer", "seller", "admin"], default: "buyer", index: true },
    phone:        { type: String, required: function() { return this.role === "seller"; } },
    profileImage: { type: String },
    seller_shop_pic: { type: String },
    seller_profile_pic: { type: String }
  }, { timestamps: true }
);

export default mongoose.model("User", userSchema);