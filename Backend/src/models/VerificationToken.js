import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    type: { type: String, enum: ["email_verification", "password_reset"], default: "email_verification" },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model("VerificationToken", verificationTokenSchema);
