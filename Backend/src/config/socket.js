import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === "production" 
        ? process.env.ALLOWED_ORIGINS?.split(",") 
        : "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Join a conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Leave a conversation room
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Send message
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, receiverId, message } = data;
        const senderId = socket.userId;

        console.log(`📨 Received message from user ${senderId}:`, { conversationId, receiverId, message });

        // Verify conversation exists and user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          console.error(`❌ Conversation ${conversationId} not found`);
          socket.emit("error", { message: "Conversation not found" });
          return;
        }

        if (!conversation.participants.includes(senderId)) {
          console.error(`❌ User ${senderId} not a participant in conversation ${conversationId}`);
          socket.emit("error", { message: "Access denied" });
          return;
        }

        console.log(`✅ Conversation verified, creating message...`);

        // Create message
        const newMessage = await Message.create({
          conversationId,
          senderId,
          receiverId,
          message
        });

        console.log(`✅ Message created:`, newMessage._id);

        // Update conversation
        const receiverRole = socket.userRole === "buyer" ? "seller" : "buyer";
        const unreadField = receiverRole === "buyer" ? "unreadCount.buyerId" : "unreadCount.sellerId";
        
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message,
          lastMessageTime: new Date(),
          $inc: { [unreadField]: 1 }
        });

        // Populate message
        const populatedMessage = await Message.findById(newMessage._id)
          .populate("senderId", "name email role")
          .populate("receiverId", "name email role");

        console.log(`📤 Emitting to conversation room: conversation:${conversationId}`);

        // Emit to conversation room
        io.to(`conversation:${conversationId}`).emit("new_message", populatedMessage);

        // Emit to receiver's personal room for notification
        io.to(`user:${receiverId}`).emit("message_notification", {
          conversationId,
          message: populatedMessage,
          sender: populatedMessage.senderId
        });

        console.log(`✅ Message sent successfully in conversation ${conversationId}`);
      } catch (error) {
        console.error("❌ Error sending message:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Mark messages as read
    socket.on("mark_read", async (data) => {
      try {
        const { conversationId } = data;
        const userId = socket.userId;

        // Verify user is part of conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
          return;
        }

        // Mark messages as read
        await Message.updateMany(
          {
            conversationId,
            receiverId: userId,
            isRead: false
          },
          {
            isRead: true,
            readAt: new Date()
          }
        );

        // Reset unread count
        const unreadField = socket.userRole === "buyer" ? "unreadCount.buyerId" : "unreadCount.sellerId";
        await Conversation.findByIdAndUpdate(conversationId, {
          [unreadField]: 0
        });

        // Notify other participants
        io.to(`conversation:${conversationId}`).emit("messages_read", {
          conversationId,
          userId
        });

        console.log(`Messages marked as read in conversation ${conversationId}`);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // User typing indicator
    socket.on("typing", (data) => {
      const { conversationId, isTyping } = data;
      socket.to(`conversation:${conversationId}`).emit("user_typing", {
        userId: socket.userId,
        isTyping
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
