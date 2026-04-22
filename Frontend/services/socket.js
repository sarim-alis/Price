import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { serverConfig } from '../config/server';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || serverConfig.SOCKET_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  async connect() {
    try {
      // If already connected, return
      if (this.socket && this.connected) {
        console.log("Socket already connected");
        return this.socket;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found for socket connection");
        return;
      }

      console.log("🔌 Connecting to Socket.IO server:", SOCKET_URL);
      console.log("📍 EXPO_PUBLIC_API_URL:", process.env.EXPO_PUBLIC_API_URL);

      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        timeout: 20000,
        autoConnect: true,
        forceNew: false,
        upgrade: true,
        rememberUpgrade: true
      });

      // Wait for connection
      return new Promise((resolve, reject) => {
        this.socket.on("connect", () => {
          // console.log("✅ Socket connected:", this.socket.id);
          this.connected = true;
          resolve(this.socket);
        });

        this.socket.on("disconnect", (reason) => {
          // console.log("❌ Socket disconnected:", reason);
          this.connected = false;
        });

        this.socket.on("connect_error", (error) => {
          console.error("❌ Socket connection error:", error.message);
          console.error("❌ Error details:", error);
          this.connected = false;
          reject(error);
        });

        this.socket.on("reconnect_attempt", (attemptNumber) => {
          console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
        });

        this.socket.on("reconnect_failed", () => {
          console.error("❌ All reconnection attempts failed");
        });

        this.socket.on("reconnect", (attemptNumber) => {
          console.log(`✅ Reconnected after ${attemptNumber} attempts`);
          this.connected = true;
        });

        // Timeout after 30 seconds
        const timeoutId = setTimeout(() => {
          if (!this.connected) {
            console.error("❌ Socket connection timeout after 30s");
            console.error("❌ Server URL:", SOCKET_URL);
            this.socket?.disconnect();
            reject(new Error("Connection timeout - please check your network and server"));
          }
        }, 30000);

        this.socket.on("connect", () => {
          clearTimeout(timeoutId);
        });
      });
    } catch (error) {
      console.error("❌ Error connecting socket:", error);
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }

  // Join a conversation room
  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit("join_conversation", conversationId);
    }
  }

  // Leave a conversation room
  leaveConversation(conversationId) {
    if (this.socket) {
      this.socket.emit("leave_conversation", conversationId);
    }
  }

  // Send a message
  sendMessage(data) {
    if (this.socket) {
      this.socket.emit("send_message", data);
    }
  }

  // Mark messages as read
  markAsRead(conversationId) {
    if (this.socket) {
      this.socket.emit("mark_read", { conversationId });
    }
  }

  // Send typing indicator
  sendTyping(conversationId, isTyping) {
    if (this.socket) {
      this.socket.emit("typing", { conversationId, isTyping });
    }
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("new_message", callback);
    }
  }

  // Listen for message notifications
  onMessageNotification(callback) {
    if (this.socket) {
      this.socket.on("message_notification", callback);
    }
  }

  // Listen for messages read
  onMessagesRead(callback) {
    if (this.socket) {
      this.socket.on("messages_read", callback);
    }
  }

  // Listen for typing indicator
  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on("user_typing", callback);
    }
  }

  // Listen for errors
  onError(callback) {
    if (this.socket) {
      this.socket.on("error", callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Remove specific listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();
