import api from './api';

// Create new task (Manager/Admin)
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

// Get all tasks (Manager/Admin)
export const getAllTasks = async () => {
  const response = await api.get('/tasks/all');
  return response.data;
};

// Get my tasks (Employee)
export const getMyTasks = async () => {
  const response = await api.get('/tasks/my-tasks');
  return response.data;
};

// Get task by ID
export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

// Update task (Manager/Admin)
export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

// Update task status (Employee)
export const updateTaskStatus = async (taskId, status) => {
  const response = await api.put(`/tasks/${taskId}/status`, { status });
  return response.data;
};

// Delete task (Manager/Admin)
export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

// Add comment to task
export const addComment = async (taskId, text) => {
  const response = await api.post(`/tasks/${taskId}/comments`, { text });
  return response.data;
};

// Get task statistics (Manager/Admin)
export const getTaskStats = async () => {
  const response = await api.get('/tasks/stats');
  return response.data;
};