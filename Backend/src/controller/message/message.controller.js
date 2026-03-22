import Message from "../../models/Message.js";
import Conversation from "../../models/Conversation.js";

// Get or create conversation between two users
export const getOrCreateConversation = async (req, res) => {
  try {
    const { otherUserId, mobileId } = req.body;
    const userId = req.user.id;

    if (!otherUserId) {
      return res.status(400).json({ message: "Other user ID is required" });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] }
    }).populate("participants", "name email role");

    // If not, create new conversation
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, otherUserId],
        mobileId: mobileId || null
      });
      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "name email role");
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations for logged-in user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("participants", "name email role phone")
      .populate("mobileId", "brand model price images")
      .sort({ lastMessageTime: -1 });

    // Format conversations to show other participant info
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        p => p._id.toString() !== userId
      );
      
      const unreadCount = req.user.role === "buyer" 
        ? conv.unreadCount.buyerId 
        : conv.unreadCount.sellerId;

      return {
        _id: conv._id,
        otherUser: otherParticipant,
        mobile: conv.mobileId,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime,
        unreadCount: unreadCount,
        createdAt: conv.createdAt
      };
    });

    res.json(formattedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a specific conversation
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      // Return empty messages array if conversation doesn't exist yet
      return res.json({
        messages: [],
        totalPages: 0,
        currentPage: 1,
        total: 0
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ conversationId })
      .populate("senderId", "name email role")
      .populate("receiverId", "name email role")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ conversationId });

    res.json({
      messages: messages.reverse(),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message (REST API - also handled by Socket.IO)
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!conversationId || !receiverId || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Create message
    const newMessage = await Message.create({
      conversationId,
      senderId,
      receiverId,
      message
    });

    // Update conversation
    const receiverRole = req.user.role === "buyer" ? "seller" : "buyer";
    const unreadField = receiverRole === "buyer" ? "unreadCount.buyerId" : "unreadCount.sellerId";
    
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message,
      lastMessageTime: new Date(),
      $inc: { [unreadField]: 1 }
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "name email role")
      .populate("receiverId", "name email role");

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      // Return success if conversation doesn't exist yet (no messages to mark)
      return res.json({ message: "No messages to mark as read" });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Mark all unread messages as read
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

    // Reset unread count for this user
    const unreadField = req.user.role === "buyer" ? "unreadCount.buyerId" : "unreadCount.sellerId";
    await Conversation.findByIdAndUpdate(conversationId, {
      [unreadField]: 0
    });

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can delete their message
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Message.findByIdAndDelete(messageId);
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
