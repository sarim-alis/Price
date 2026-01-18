const API_URL = "http://localhost:5000/api";

// Login.
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

// Register.
export const register = async (name, email, password) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role: "seller" }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

// Logout.
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get token.
export const getToken = () => localStorage.getItem("token");

// Get user.
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Check if logged in.
export const isLoggedIn = () => !!localStorage.getItem("token");
