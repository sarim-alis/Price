import { Router } from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  deleteMessage
} from "../../controller/message/message.controller.js";
import { auth, requirePhoneVerified } from "../../middleware/auth.js";

const router = Router();

// All routes require authentication
router.post("/conversation", auth, requirePhoneVerified, getOrCreateConversation);
router.get("/conversations", auth, getUserConversations);
router.get("/conversation/:conversationId", auth, getConversationMessages);
router.post("/send", auth, requirePhoneVerified, sendMessage);
router.put("/conversation/:conversationId/read", auth, requirePhoneVerified, markMessagesAsRead);
router.delete("/:messageId", auth, requirePhoneVerified, deleteMessage);

export default router;
