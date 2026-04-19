import { Router } from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  deleteMessage
} from "../../controller/message/message.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

// All routes require authentication
router.post("/conversation", auth, getOrCreateConversation);
router.get("/conversations", auth, getUserConversations);
router.get("/conversation/:conversationId", auth, getConversationMessages);
router.post("/send", auth, sendMessage);
router.put("/conversation/:conversationId/read", auth, markMessagesAsRead);
router.delete("/:messageId", auth, deleteMessage);

export default router;
