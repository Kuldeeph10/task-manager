import api from './api';

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Get pending users for approval (Admin only)
export const getPendingUsers = async () => {
  const response = await api.get('/users/pending');
  return response.data;
};

// Approve user (Admin only)
export const approveUser = async (userId) => {
  const response = await api.put(`/users/${userId}/approve`);
  return response.data;
};

// Delete user (Admin only)
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Update user role (Admin only)
export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/users/${userId}/role`, { role });
  return response.data;
};

// Get all employees (Manager/Admin)
export const getEmployees = async () => {
  const response = await api.get('/users/employees');
  return response.data;
};

//  new changes

// ... existing imports and functions ...

// Update user profile
export const updateUserProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

