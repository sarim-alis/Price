import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.18.203:5000/api";

// Profile APIs
export const getProfile = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
  return data;
};

export const updateProfile = async (profileData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update profile");
  return data;
};

export const addMobile = async (mobileData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/mobiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(mobileData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to add mobile");
  return data;
};

export const deleteMobile = async (mobileId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/mobiles/${mobileId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete mobile");
  return data;
};

export const updateMobile = async (mobileId, mobileData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}/mobiles/${mobileId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(mobileData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update mobile");
  return data;
};

// Seller APIs
export const getSellerById = async (id) => {
  const response = await fetch(`${API_URL}/seller/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Seller not found");
  return data;
};

export const getAllSellers = async () => {
  const response = await fetch(`${API_URL}/seller/all`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch sellers");
  return data;
};

// Get all mobiles (optional: brand, minPrice, maxPrice, condition, page, limit).
export const getMobiles = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_URL}/mobiles${qs ? `?${qs}` : ""}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch mobiles");
  return data;
};

// Get flash sale mobiles (iPhone, Samsung, Realme)
export const getFlashSaleMobiles = async () => {
  try {
    // Fetch iPhone, Samsung, and Realme mobiles with limit 1 each
    const [iphoneData, samsungData, realmeData] = await Promise.all([
      getMobiles({ brand: 'apple', limit: 1, sortBy: 'price', order: 'asc' }),
      getMobiles({ brand: 'samsung', limit: 1, sortBy: 'price', order: 'asc' }),
      getMobiles({ brand: 'realme', limit: 1, sortBy: 'price', order: 'asc' })
    ]);
    
    const flashSaleMobiles = [];
    
    if (iphoneData.mobiles && iphoneData.mobiles.length > 0) {
      const mobile = iphoneData.mobiles[0];
      flashSaleMobiles.push({
        ...mobile,
        discount: Math.round((1 - mobile.price / (mobile.price * 4)) * 100), // Simulate 75% off
        originalPrice: Math.round(mobile.price * 4),
        sold: 'iPhone 15 Pro'
      });
    }
    
    if (samsungData.mobiles && samsungData.mobiles.length > 0) {
      const mobile = samsungData.mobiles[0];
      flashSaleMobiles.push({
        ...mobile,
        discount: Math.round((1 - mobile.price / (mobile.price * 3.5)) * 100), // Simulate 72% off
        originalPrice: Math.round(mobile.price * 3.5),
        sold: 'Samsung S24'
      });
    }
    
    if (realmeData.mobiles && realmeData.mobiles.length > 0) {
      const mobile = realmeData.mobiles[0];
      flashSaleMobiles.push({
        ...mobile,
        discount: Math.round((1 - mobile.price / (mobile.price * 2.3)) * 100), // Simulate 57% off
        originalPrice: Math.round(mobile.price * 2.3),
        sold: 'Realme 12'
      });
    }
    
    return flashSaleMobiles;
  } catch (error) {
    // Fallback to hardcoded data if API fails
    return [
      {
        image: "https://res.cloudinary.com/dgk3gaml0/image/upload/v1768789028/r1fubc2z7du0t5gnpm8o.jpg",
        price: 292,
        originalPrice: 1200,
        discount: 76,
        sold: "iPhone 15 Pro"
      },
      {
        image: "https://res.cloudinary.com/dgk3gaml0/image/upload/v1768788796/ob4nrnqdawiepvw4b1vc.webp",
        price: 832,
        originalPrice: 2980,
        discount: 72,
        sold: "Samsung S24"
      },
      {
        image: "https://res.cloudinary.com/dgk3gaml0/image/upload/v1768788851/dhzamx2qwfcpbfrh78jb.jpg",
        price: 430,
        originalPrice: 1000,
        discount: 57,
        sold: "Realme 12"
      }
    ];
  }
};

// Get single mobile by id (includes populated seller).
export const getMobileById = async (id) => {
  const response = await fetch(`${API_URL}/mobiles/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Mobile not found");
  return data;
};

// Get mobiles by seller ID.
export const getMobilesBySellerId = async (sellerId, page = 1, limit = 3) => {
  const response = await fetch(`${API_URL}/mobiles/seller/${sellerId}?page=${page}&limit=${limit}`);
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
