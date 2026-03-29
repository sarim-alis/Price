import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants:    [{type: mongoose.Schema.Types.ObjectId, ref: "User",   required: true  }],
  mobileId:        { type: mongoose.Schema.Types.ObjectId, ref: "Mobile", required: false },
  lastMessage:     { type: String, default: ""},
  lastMessageTime: { type: Date,   default: Date.now },
  unreadCount: { buyerId: { type: Number, default: 0 }, sellerId: { type: Number, default: 0 }}
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageTime: -1 });

export default mongoose.model("Conversation", conversationSchema);
