import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String },
    type: { type: String, enum: ["email_verification", "password_reset", "phone_verification"], default: "email_verification" },
    code: { type: String },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model("VerificationToken", verificationTokenSchema);
