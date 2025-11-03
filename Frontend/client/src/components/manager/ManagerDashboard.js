import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTaskStats, getAllTasks } from '../../services/taskService';
import Loader from '../common/Loader';
import { formatDate, getStatusBadgeClass, getPriorityBadgeClass } from '../../utils/helpers';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, tasksResponse] = await Promise.all([
        getTaskStats(),
        getAllTasks(),
      ]);

      setStats(statsResponse.data || {});
      setRecentTasks(tasksResponse.data?.slice(0, 5) || []);
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
        <p>Manage your team's tasks and track progress efficiently.</p>
        <div className="quick-actions">
          <Link to="/create-task" className="quick-action-btn">
            <i className="bi bi-plus-circle"></i>
            Create New Task
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
              <i className="bi bi-clipboard-data"></i>
            </div>
            <h3>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="stats-card stats-pending">
            <div className="stats-icon">
              <i className="bi bi-hourglass-split"></i>
            </div>
            <h3>{stats.pending}</h3>
            <p>Pending Tasks</p>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="stats-card stats-progress">
            <div className="stats-icon">
              <i className="bi bi-arrow-repeat"></i>
            </div>
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="stats-card stats-completed">
            <div className="stats-icon">
              <i className="bi bi-check-circle"></i>
            </div>
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="dashboard-section">
        <div className="section-header">
          <h4>
            <i className="bi bi-clock-history me-2"></i>
            Recent Tasks
          </h4>
          <Link to="/tasks" className="btn btn-sm btn-primary-custom">
            View All
          </Link>
        </div>

        {recentTasks.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <Link to={`/tasks/${task._id}`} className="text-decoration-none text-dark fw-semibold">
                        {task.title}
                      </Link>
                    </td>
                    <td>{task.assignedTo?.name}</td>
                    <td>
                      <span className={getPriorityBadgeClass(task.priority)}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(task.status)}>
                        {STATUS_LABELS[task.status]}
                      </span>
                    </td>
                    <td>{formatDate(task.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <i className="bi bi-inbox empty-state-icon"></i>
            <h5>No tasks yet</h5>
            <p>Create your first task to get started.</p>
            <Link to="/create-task" className="btn btn-primary-custom">
              <i className="bi bi-plus-circle me-2"></i>
              Create Task
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;