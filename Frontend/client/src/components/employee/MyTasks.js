import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyTasks } from '../../services/taskService';
import Loader from '../common/Loader';
import TaskCard from './TaskCard';
import { TASK_STATUS } from '../../utils/constants';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMyTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter, searchQuery]);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await getMyTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch your tasks');
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
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const getStatusCount = (status) => {
    if (status === 'all') return tasks.length;
    return tasks.filter((task) => task.status === status).length;
  };

  const handleTaskUpdate = () => {
    fetchMyTasks();
  };

  if (loading) {
    return <Loader message="Loading your tasks..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">
            <i className="bi bi-clipboard-check me-2"></i>
            My Tasks
          </h1>
          <p className="page-subtitle">View and manage your assigned tasks</p>
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
                  All Tasks ({getStatusCount('all')})
                </button>
                <button
                  className={`btn ${
                    statusFilter === TASK_STATUS.PENDING ? 'btn-warning' : 'btn-outline-warning'
                  }`}
                  onClick={() => setStatusFilter(TASK_STATUS.PENDING)}
                >
                  Pending ({getStatusCount(TASK_STATUS.PENDING)})
                </button>
                <button
                  className={`btn ${
                    statusFilter === TASK_STATUS.IN_PROGRESS ? 'btn-info' : 'btn-outline-info'
                  }`}
                  onClick={() => setStatusFilter(TASK_STATUS.IN_PROGRESS)}
                >
                  In Progress ({getStatusCount(TASK_STATUS.IN_PROGRESS)})
                </button>
                <button
                  className={`btn ${
                    statusFilter === TASK_STATUS.COMPLETED ? 'btn-success' : 'btn-outline-success'
                  }`}
                  onClick={() => setStatusFilter(TASK_STATUS.COMPLETED)}
                >
                  Completed ({getStatusCount(TASK_STATUS.COMPLETED)})
                </button>
                <button
                  className={`btn ${
                    statusFilter === TASK_STATUS.ON_HOLD ? 'btn-secondary' : 'btn-outline-secondary'
                  }`}
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

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="row g-4">
            {filteredTasks.map((task) => (
              <div className="col-lg-6" key={task._id}>
                <TaskCard task={task} onUpdate={handleTaskUpdate} />
              </div>
            ))}
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
                  ? 'You don\'t have any tasks assigned yet'
                  : `You don't have any ${statusFilter} tasks`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;