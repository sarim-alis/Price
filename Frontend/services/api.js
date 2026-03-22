import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.100.39:5000/api";

// Get all mobiles (optional: brand, minPrice, maxPrice, condition, page, limit).
export const getMobiles = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_URL}/mobiles${qs ? `?${qs}` : ""}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch mobiles");
  return data;
};

// Get single mobile by id (includes populated seller).
export const getMobileById = async (id) => {
  const response = await fetch(`${API_URL}/mobiles/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Mobile not found");
  return data;
};

// Get mobiles by seller ID.
export const getMobilesBySellerId = async (sellerId) => {
  const response = await fetch(`${API_URL}/mobiles/seller/${sellerId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch seller mobiles");
  return data;
};

// Message APIs

// Get or create conversation
export const getOrCreateConversation = async (otherUserId, mobileId = null) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/messages/conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ otherUserId, mobileId })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create conversation");
  return data;
};

// Get all conversations for logged-in user
export const getUserConversations = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/messages/conversations`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch conversations");
  return data;
};

// Get messages for a conversation
export const getConversationMessages = async (conversationId, page = 1, limit = 50) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/messages/conversation/${conversationId}?page=${page}&limit=${limit}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch messages");
  return data;
};

// Send a message (REST API fallback)
export const sendMessage = async (conversationId, receiverId, message) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ conversationId, receiverId, message })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to send message");
  return data;
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId) => {
  if (!conversationId) {
    console.warn('markMessagesAsRead called without conversationId');
    return;
  }
  
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/messages/conversation/${conversationId}/read`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) {
    console.warn('Failed to mark messages as read:', data.message);
    throw new Error(data.message || "Failed to mark messages as read");
  }
  return data;
};
