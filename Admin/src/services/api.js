import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all sellers
export const getAllSellers = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/sellers/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch sellers');
  }
  
  return data.sellers;
};

// Get seller by ID
export const getSellerById = async (id) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/sellers/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch seller');
  }
  
  return data.seller;
};

// Create seller
export const createSeller = async (sellerData) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/sellers/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(sellerData)
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create seller');
  }
  
  return data.seller;
};

// Get all buyers
export const getAllBuyers = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/buyers/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch buyers');
  }
  
  return data.buyers;
};

// Get buyer by ID
export const getBuyerById = async (id) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/buyers/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch buyer');
  }
  
  return data.buyer;
};
