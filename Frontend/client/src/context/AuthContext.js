import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserFromStorage, getTokenFromStorage, logout as logoutService } from '../services/authService';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedUser = getUserFromStorage();
      const storedToken = getTokenFromStorage();
      
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    logoutService();
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is manager
  const isManager = () => {
    return user?.role === 'manager';
  };

  // Check if user is employee
  const isEmployee = () => {
    return user?.role === 'employee';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    hasRole,
    isAdmin,
    isManager,
    isEmployee,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};