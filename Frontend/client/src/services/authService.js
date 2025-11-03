import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

// Register new user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.success) {
    // Save token and user data to localStorage
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
  }
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  window.location.href = '/login';
};

// Get current user profile
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  if (response.data.success) {
    // Update user data in localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
  }
  return response.data;
};

// Get user from localStorage
export const getUserFromStorage = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

// Get token from localStorage
export const getTokenFromStorage = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getTokenFromStorage();
};