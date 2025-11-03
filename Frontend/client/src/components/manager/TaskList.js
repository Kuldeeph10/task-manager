import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTasks, deleteTask } from '../../services/taskService';
import Loader from '../common/Loader';
import {
  formatDate,
  getStatusBadgeClass,
  getPriorityBadgeClass,
  isOverdue,
} from '../../utils/helpers';
import { STATUS_LABELS, PRIORITY_LABELS, TASK_STATUS } from '../../utils/constants';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter, searchQuery]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getAllTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.assignedTo?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    if (!window.confirm(`Are you sure you want to delete task: "${taskTitle}"?`)) {
      return;
    }

    try {
      await deleteTask(taskId);
      alert('Task deleted successfully!');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return tasks.length;
    return tasks.filter((task) => task.status === status).length;
  };

  if (loading) {
    return <Loader message="Loading tasks..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title">
                <i className="bi bi-list-task me-2"></i>
                All Tasks
              </h1>
              <p className="page-subtitle">Manage and track all team tasks</p>
            </div>
            <Link to="/create-task" className="btn btn-primary-custom">
              <i className="bi bi-plus-circle me-2"></i>
              Create New Task
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filter and Search */}
        <div className="card-custom mb-4">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setStatusFilter('all')}
                >
                  All ({getStatusCount('all')})
                </button>
                <button
                  className={`btn ${statusFilter === TASK_STATUS.PENDING ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setStatusFilter(TASK_STATUS.PENDING)}
                >
                  Pending ({getStatusCount(TASK_STATUS.PENDING)})
                </button>
                <button
                  className={`btn ${statusFilter === TASK_STATUS.IN_PROGRESS ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() => setStatusFilter(TASK_STATUS.IN_PROGRESS)}
                >
                  In Progress ({getStatusCount(TASK_STATUS.IN_PROGRESS)})
                </button>
                <button
                  className={`btn ${statusFilter === TASK_STATUS.COMPLETED ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setStatusFilter(TASK_STATUS.COMPLETED)}
                >
                  Completed ({getStatusCount(TASK_STATUS.COMPLETED)})
                </button>
                <button
                  className={`btn ${statusFilter === TASK_STATUS.ON_HOLD ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setStatusFilter(TASK_STATUS.ON_HOLD)}
                >
                  On Hold ({getStatusCount(TASK_STATUS.ON_HOLD)})
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        {filteredTasks.length > 0 ? (
          <div className="card-custom">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assigned To</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task._id}>
                      <td>
                        <Link
                          to={`/tasks/${task._id}`}
                          className="text-decoration-none text-dark"
                        >
                          <strong>{task.title}</strong>
                          <br />
                          <small className="text-muted">
                            {task.description.substring(0, 50)}...
                          </small>
                        </Link>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="user-avatar me-2"
                            style={{ width: '2rem', height: '2rem', fontSize: '0.875rem' }}
                          >
                            {task.assignedTo?.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{task.assignedTo?.name}</div>
                            <small className="text-muted">{task.assignedTo?.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={getPriorityBadgeClass(task.priority)}>
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(task.status)}>
                          {STATUS_LABELS[task.status]}
                        </span>
                        {isOverdue(task.dueDate) && task.status !== TASK_STATUS.COMPLETED && (
                          <span className="badge bg-danger ms-1">Overdue</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={
                            isOverdue(task.dueDate) && task.status !== TASK_STATUS.COMPLETED
                              ? 'text-danger fw-bold'
                              : ''
                          }
                        >
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                      <td>{formatDate(task.createdAt)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/tasks/${task._id}`}
                            className="btn btn-sm btn-primary"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteTask(task._id, task.title)}
                            title="Delete Task"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card-custom">
            <div className="empty-state">
              <i className="bi bi-inbox empty-state-icon"></i>
              <h5>No Tasks Found</h5>
              <p>
                {searchQuery
                  ? 'No tasks match your search criteria'
                  : statusFilter === 'all'
                  ? 'No tasks have been created yet'
                  : `No ${STATUS_LABELS[statusFilter].toLowerCase()} tasks`}
              </p>
              {statusFilter === 'all' && !searchQuery && (
                <Link to="/create-task" className="btn btn-primary-custom">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create First Task
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;