import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPendingUsers, getAllUsers } from '../../services/userService';
import { getTaskStats } from '../../services/taskService';
import Loader from '../common/Loader';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersResponse, pendingResponse, tasksResponse] = await Promise.all([
        getAllUsers(),
        getPendingUsers(),
        getTaskStats(),
      ]);

      setStats({
        totalUsers: usersResponse.count || 0,
        pendingApprovals: pendingResponse.count || 0,
        totalTasks: tasksResponse.data?.total || 0,
        pendingTasks: tasksResponse.data?.pending || 0,
        inProgressTasks: tasksResponse.data?.inProgress || 0,
        completedTasks: tasksResponse.data?.completed || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>Welcome back, {user?.name}! 👋</h2>
        <p>Here's what's happening with your organization today.</p>
        <div className="quick-actions">
          <Link to="/users" className="quick-action-btn">
            <i className="bi bi-people"></i>
            Manage Users
          </Link>
          <Link to="/pending-approvals" className="quick-action-btn">
            <i className="bi bi-person-check"></i>
            Pending Approvals
          </Link>
          <Link to="/tasks" className="quick-action-btn">
            <i className="bi bi-list-task"></i>
            View All Tasks
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4">
        <div className="col-md-6 col-xl-3">
          <div className="stats-card stats-total">
            <div className="stats-icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="stats-card stats-pending">
            <div className="stats-icon">
              <i className="bi bi-person-check-fill"></i>
            </div>
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="stats-card stats-progress">
            <div className="stats-icon">
              <i className="bi bi-list-task"></i>
            </div>
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="stats-card stats-completed">
            <div className="stats-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <h3>{stats.completedTasks}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>
      </div>

      {/* Task Overview */}
      <div className="dashboard-section">
        <div className="section-header">
          <h4>
            <i className="bi bi-bar-chart-fill me-2"></i>
            Task Overview
          </h4>
          <Link to="/tasks" className="btn btn-sm btn-primary-custom">
            View All Tasks
          </Link>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="card border-0" style={{ borderLeft: '4px solid var(--warning)' }}>
              <div className="card-body">
                <h6 className="text-muted mb-2">Pending Tasks</h6>
                <h3 className="mb-0">{stats.pendingTasks}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0" style={{ borderLeft: '4px solid var(--info)' }}>
              <div className="card-body">
                <h6 className="text-muted mb-2">In Progress</h6>
                <h3 className="mb-0">{stats.inProgressTasks}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0" style={{ borderLeft: '4px solid var(--success)' }}>
              <div className="card-body">
                <h6 className="text-muted mb-2">Completed</h6>
                <h3 className="mb-0">{stats.completedTasks}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Alert */}
      {stats.pendingApprovals > 0 && (
        <div className="alert alert-custom alert-warning">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          You have <strong>{stats.pendingApprovals}</strong> pending user approval(s).{' '}
          <Link to="/pending-approvals" className="alert-link">
            Review now
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;