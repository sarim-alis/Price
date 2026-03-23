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

// ============== ORDER APIs ==============

// Create new order
export const createOrder = async (mobileId, paymentMethod, sellerPaymentInfo) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ mobileId, paymentMethod, sellerPaymentInfo })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create order");
  return data;
};

// Get buyer's orders
export const getBuyerOrders = async (status) => {
  const token = await AsyncStorage.getItem("token");
  const url = status ? `${API_URL}/orders/buyer/my-orders?status=${status}` : `${API_URL}/orders/buyer/my-orders`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch orders");
  return data;
};

// Get seller's orders
export const getSellerOrders = async (status) => {
  const token = await AsyncStorage.getItem("token");
  const url = status ? `${API_URL}/orders/seller/my-orders?status=${status}` : `${API_URL}/orders/seller/my-orders`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch orders");
  return data;
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch order");
  return data;
};

// Upload payment proof
export const uploadPaymentProof = async (orderId, imageFile) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    
    // React Native requires specific format for file uploads
    const fileUri = imageFile.uri;
    const fileType = imageFile.mimeType || 'image/jpeg';
    const fileName = imageFile.fileName || `payment-${Date.now()}.jpg`;
    
    console.log('Uploading payment proof:', { orderId, fileUri, fileType, fileName });
    
    formData.append('paymentProof', {
      uri: fileUri,
      type: fileType,
      name: fileName
    });

    const response = await fetch(`${API_URL}/orders/${orderId}/payment-proof`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      },
      body: formData
    });
    
    console.log('Upload response status:', response.status);
    
    const data = await response.json();
    console.log('Upload response data:', data);
    
    if (!response.ok) throw new Error(data.message || "Failed to upload payment proof");
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Confirm payment (seller)
export const confirmPayment = async (orderId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/orders/${orderId}/confirm-payment`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to confirm payment");
  return data;
};

// Update order status (seller)
export const updateOrderStatus = async (orderId, status) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update order status");
  return data;
};

// Generate invoice
export const generateInvoice = async (orderId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to generate invoice");
  return data;
};

// Get invoice
export const getInvoice = async (orderId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch invoice");
  return data;
};

// Download invoice URL
export const getInvoiceDownloadUrl = (orderId) => {
  return `${API_URL}/orders/${orderId}/invoice/download`;
};
