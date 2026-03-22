const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.100.94:5000/api";

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
