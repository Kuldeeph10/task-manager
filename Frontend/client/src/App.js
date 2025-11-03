import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import MyTasksPage from './pages/MyTasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import UsersPage from './pages/UsersPage';
import PendingApprovalsPage from './pages/PendingApprovalsPage';
import ProfilePage from './pages/ProfilePage'; // Add this
import NotFoundPage from './pages/NotFoundPage';

// Auth Component
import PrivateRoute from './components/auth/PrivateRoute';

// Loader
import Loader from './components/common/Loader';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader message="Loading application..." />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes - All Users */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      
      {/* Add Profile Route - All authenticated users */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* Protected Routes - Admin Only */}
      <Route
        path="/users"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <UsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pending-approvals"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <PendingApprovalsPage />
          </PrivateRoute>
        }
      />

      {/* Protected Routes - Manager & Admin */}
      <Route
        path="/tasks"
        element={
          <PrivateRoute allowedRoles={['admin', 'manager']}>
            <TasksPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <PrivateRoute allowedRoles={['admin', 'manager']}>
            <TasksPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-task"
        element={
          <PrivateRoute allowedRoles={['admin', 'manager']}>
            <CreateTaskPage />
          </PrivateRoute>
        }
      />

      {/* Protected Routes - Employee */}
      <Route
        path="/my-tasks"
        element={
          <PrivateRoute allowedRoles={['employee']}>
            <MyTasksPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-tasks/:id"
        element={
          <PrivateRoute allowedRoles={['employee']}>
            <MyTasksPage />
          </PrivateRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;