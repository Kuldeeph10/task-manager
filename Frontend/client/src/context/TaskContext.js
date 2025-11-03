import React, { createContext, useState, useContext } from 'react';

// Create Task Context
const TaskContext = createContext();

// Custom hook to use Task Context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
};

// Task Provider Component
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update tasks list
  const updateTasks = (newTasks) => {
    setTasks(newTasks);
  };

  // Add new task
  const addTask = (task) => {
    setTasks([task, ...tasks]);
  };

  // Update specific task
  const updateTask = (taskId, updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === taskId ? { ...task, ...updatedTask } : task
    ));
  };

  // Remove task
  const removeTask = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
  };

  // Select task for details/editing
  const selectTask = (task) => {
    setSelectedTask(task);
  };

  // Clear selected task
  const clearSelectedTask = () => {
    setSelectedTask(null);
  };

  // Filter tasks by status
  const getTasksByStatus = (status) => {
    if (!status || status === 'all') return tasks;
    return tasks.filter(task => task.status === status);
  };

  // Get task count by status
  const getTaskCountByStatus = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  const value = {
    tasks,
    selectedTask,
    loading,
    setLoading,
    updateTasks,
    addTask,
    updateTask,
    removeTask,
    selectTask,
    clearSelectedTask,
    getTasksByStatus,
    getTaskCountByStatus,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};