import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.100.94:5000/api";

// Login.
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

// Register.
export const register = async (name, email, password) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

// Logout.
export const logout = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};

// Get token.
export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

// Get user.
export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Check if logged in.
export const isLoggedIn = async () => {
  const token = await AsyncStorage.getItem("token");
  return !!token;
};

// Seller Login.
export const sellerLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  
  // Check if user has seller role
  if (data.user.role !== "seller") {
    throw new Error("This account is not registered as a seller");
  }
  
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

// Seller Register.
export const sellerRegister = async (name, email, password, phone, cnic, sellerShopPic, sellerProfilePic) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name, 
      email, 
      password, 
      phone, 
      cnic, 
      seller_shop_pic: sellerShopPic,
      seller_profile_pic: sellerProfilePic,
      role: "seller" 
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("user", JSON.stringify(data.user));
  return data;
};
