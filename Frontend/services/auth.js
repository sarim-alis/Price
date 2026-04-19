import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.18.227:5000/api";

// Login.
export const login = async (email, password) => {  
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();    
    if (!response.ok) {
      const error = new Error(data.message);
      error.emailVerified = data.emailVerified;
      console.error('Login failed:', data.message);
      throw error;
    }
    
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    console.log('=== LOGIN SUCCESS ===');
    return data;
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error message:', error.message);
    if (error.message.includes('Network request failed')) {
      console.error('Network error - Check backend URL:', API_URL);
    }
    throw error;
  }
};

// Register.
export const register = async (name, email, password) => {
  console.log('=== REGISTER START ===');
  console.log('API_URL:', API_URL);
  const requestBody = { 
    name, 
    email, 
    password,
    profileImage: ''
  };
  console.log('Request body:', JSON.stringify(requestBody, null, 2));
  
  try {
    console.log('Fetching:', `${API_URL}/users/register`);
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('Registration failed:', data.message);
      throw new Error(data.message);
    }
    
    console.log('=== REGISTER SUCCESS ===');
    return data;
  } catch (error) {
    console.error('=== REGISTER ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.message.includes('Network request failed')) {
      console.error('Network error - Check if backend is running and accessible');
      console.error('Backend URL:', API_URL);
    }
    
    throw error;
  }
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
  console.log('=== SELLER LOGIN START ===');
  console.log('API_URL:', API_URL);
  console.log('Email:', email);
  
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      const error = new Error(data.message);
      error.emailVerified = data.emailVerified;
      console.error('Seller login failed:', data.message);
      throw error;
    }
    
    // Check if user has seller role
    if (data.user.role !== "seller") {
      console.error('Not a seller account');
      throw new Error("This account is not registered as a seller");
    }
    
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    console.log('=== SELLER LOGIN SUCCESS ===');
    return data;
  } catch (error) {
    console.error('=== SELLER LOGIN ERROR ===');
    console.error('Error message:', error.message);
    if (error.message.includes('Network request failed')) {
      console.error('Network error - Check backend URL:', API_URL);
    }
    throw error;
  }
};

// Seller Register.
export const sellerRegister = async (name, email, password, cnic) => {
  console.log('=== SELLER REGISTER START ===');
  console.log('API_URL:', API_URL);
  const requestBody = { 
    name, 
    email, 
    password, 
    cnic,
    role: "seller",
    profileImage: '',
    shopPic: '',
    address: '',
    bankDetail: '',
    easypaisaDetail: '',
    jazzcashDetail: ''
  };
  console.log('Request body:', JSON.stringify(requestBody, null, 2));
  
  try {
    console.log('Fetching:', `${API_URL}/users/register`);
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('Seller registration failed:', data.message);
      throw new Error(data.message);
    }
    
    console.log('=== SELLER REGISTER SUCCESS ===');
    return data;
  } catch (error) {
    console.error('=== SELLER REGISTER ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.message.includes('Network request failed')) {
      console.error('Network error - Check if backend is running and accessible');
      console.error('Backend URL:', API_URL);
    }
    
    throw error;
  }
};

// Send verification email.
export const sendVerificationEmail = async (email) => {
  const response = await fetch(`${API_URL}/verification/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

// Verify email with token.
export const verifyEmail = async (token) => {
  const response = await fetch(`${API_URL}/verification/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

// Resend verification email.
export const resendVerificationEmail = async (email) => {
  const response = await fetch(`${API_URL}/verification/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
