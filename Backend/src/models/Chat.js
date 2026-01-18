import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message:  { type: String, required: true },
    reply:    { type: String },
    language: { type: String, default: "en" }
  }, { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);