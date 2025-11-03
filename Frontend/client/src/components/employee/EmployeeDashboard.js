import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyTasks } from '../../services/taskService';
import Loader from '../common/Loader';
import { formatDate, getStatusBadgeClass, getPriorityBadgeClass, isOverdue } from '../../utils/helpers';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await getMyTasks();
      const myTasks = response.data || [];
      setTasks(myTasks);

      // Calculate stats
      const taskStats = {
        total: myTasks.length,
        pending: myTasks.filter((t) => t.status === 'pending').length,
        inProgress: myTasks.filter((t) => t.status === 'in-progress').length,
        completed: myTasks.filter((t) => t.status === 'completed').length,
        overdue: myTasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'completed').length,
      };
      setStats(taskStats);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading your tasks..." />;
  }

  const upcomingTasks = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>Welcome back, {user?.name}! 👋</h2>
        <p>Stay organized and manage your tasks efficiently.</p>
        <div className="quick-actions">
          <Link to="/my-tasks" className="quick-action-btn">
            <i className="bi bi-clipboard-check"></i>
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

      {/* Overdue Alert */}
      {stats.overdue > 0 && (
        <div className="alert alert-custom alert-danger mt-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          You have <strong>{stats.overdue}</strong> overdue task(s).{' '}
          <Link to="/my-tasks" className="alert-link">
            Review now
          </Link>
        </div>
      )}

      {/* Upcoming Tasks */}
      <div className="dashboard-section">
        <div className="section-header">
          <h4>
            <i className="bi bi-calendar-check me-2"></i>
            Upcoming Tasks
          </h4>
          <Link to="/my-tasks" className="btn btn-sm btn-primary-custom">
            View All
          </Link>
        </div>

        {upcomingTasks.length > 0 ? (
          <div className="row g-3">
            {upcomingTasks.map((task) => (
              <div className="col-12" key={task._id}>
                <div className={`task-card priority-${task.priority}`}>
                  <div className="task-header">
                    <div>
                      <h5 className="task-title">{task.title}</h5>
                      <div className="task-badges">
                        <span className={getPriorityBadgeClass(task.priority)}>
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                        <span className={getStatusBadgeClass(task.status)}>
                          {STATUS_LABELS[task.status]}
                        </span>
                        {isOverdue(task.dueDate) && task.status !== 'completed' && (
                          <span className="badge bg-danger">Overdue</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="task-description">{task.description}</p>

                  <div className="task-meta">
                    <div className="task-meta-item">
                      <i className="bi bi-person"></i>
                      <span>Assigned by: {task.assignedBy?.name}</span>
                    </div>
                    <div className="task-meta-item">
                      <i className="bi bi-calendar"></i>
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <Link to={`/my-tasks/${task._id}`} className="btn btn-sm btn-primary-custom">
                      <i className="bi bi-eye me-1"></i>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="bi bi-check-circle empty-state-icon"></i>
            <h5>All caught up!</h5>
            <p>You don't have any pending tasks at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;