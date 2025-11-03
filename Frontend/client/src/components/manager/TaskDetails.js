import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTaskById, updateTask, addComment, deleteTask } from '../../services/taskService';
import { getEmployees } from '../../services/userService';
import Loader from '../common/Loader';
import Modal from '../common/Modal';
import {
  formatDate,
  formatDateTime,
  getStatusBadgeClass,
  getPriorityBadgeClass,
  isOverdue,
  getInitials,
} from '../../utils/helpers';
import { STATUS_LABELS, PRIORITY_LABELS, TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
    fetchEmployees();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await getTaskById(id);
      setTask(response.data);
      setEditFormData({
        title: response.data.title,
        description: response.data.description,
        assignedTo: response.data.assignedTo._id,
        priority: response.data.priority,
        status: response.data.status,
        dueDate: response.data.dueDate.split('T')[0],
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      alert('Failed to fetch task details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateTask = async () => {
    try {
      setSubmitting(true);
      await updateTask(id, editFormData);
      alert('Task updated successfully!');
      setShowEditModal(false);
      fetchTaskDetails();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      await addComment(id, comment);
      setComment('');
      fetchTaskDetails();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(id);
      alert('Task deleted successfully!');
      navigate('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  if (loading) {
    return <Loader message="Loading task details..." />;
  }

  if (!task) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Task not found</div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title">
                <i className="bi bi-clipboard-check me-2"></i>
                Task Details
              </h1>
              <p className="page-subtitle">View and manage task information</p>
            </div>
            <Link to="/tasks" className="btn btn-secondary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Tasks
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* Main Task Details */}
          <div className="col-lg-8">
            <div className="card-custom mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="h4 mb-2">{task.title}</h2>
                  <div className="d-flex gap-2 flex-wrap">
                    <span className={getPriorityBadgeClass(task.priority)}>
                      <i className="bi bi-flag-fill me-1"></i>
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                    <span className={getStatusBadgeClass(task.status)}>
                      <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                      {STATUS_LABELS[task.status]}
                    </span>
                    {isOverdue(task.dueDate) && task.status !== TASK_STATUS.COMPLETED && (
                      <span className="badge bg-danger">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setShowEditModal(true)}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={handleDeleteTask}>
                    <i className="bi bi-trash me-1"></i>
                    Delete
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="text-muted mb-2">Description</h6>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {task.description}
                </p>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Assigned To</small>
                    <div className="d-flex align-items-center">
                      <div className="user-avatar me-2" style={{ width: '2.5rem', height: '2.5rem' }}>
                        {getInitials(task.assignedTo.name)}
                      </div>
                      <div>
                        <strong>{task.assignedTo.name}</strong>
                        <br />
                        <small className="text-muted">{task.assignedTo.email}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Assigned By</small>
                    <div className="d-flex align-items-center">
                      <div className="user-avatar me-2" style={{ width: '2.5rem', height: '2.5rem' }}>
                        {getInitials(task.assignedBy.name)}
                      </div>
                      <div>
                        <strong>{task.assignedBy.name}</strong>
                        <br />
                        <small className="text-muted">{task.assignedBy.email}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Due Date</small>
                    <strong
                      className={
                        isOverdue(task.dueDate) && task.status !== TASK_STATUS.COMPLETED
                          ? 'text-danger'
                          : ''
                      }
                    >
                      <i className="bi bi-calendar-event me-1"></i>
                      {formatDate(task.dueDate)}
                    </strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Created On</small>
                    <strong>
                      <i className="bi bi-clock me-1"></i>
                      {formatDate(task.createdAt)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="card-custom">
              <h5 className="mb-4">
                <i className="bi bi-chat-left-text me-2"></i>
                Comments ({task.comments?.length || 0})
              </h5>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary-custom"
                  disabled={submitting || !comment.trim()}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Add Comment
                    </>
                  )}
                </button>
              </form>

              {/* Comments List */}
              {task.comments && task.comments.length > 0 ? (
                <div className="comments-list">
                  {task.comments.map((comment, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon icon-comment">
                        {getInitials(comment.user?.name || 'Unknown')}
                      </div>
                      <div className="activity-content flex-grow-1">
                        <h6 className="mb-1">
                          {comment.user?.name || 'Unknown User'}
                          <span className="text-muted fw-normal ms-2" style={{ fontSize: '0.875rem' }}>
                            {formatDateTime(comment.createdAt)}
                          </span>
                        </h6>
                        <p className="mb-0">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-chat-left-dots" style={{ fontSize: '2rem' }}></i>
                  <p className="mt-2 mb-0">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card-custom">
              <h5 className="mb-3">
                <i className="bi bi-info-circle me-2"></i>
                Task Information
              </h5>
              <div className="mb-3">
                <small className="text-muted d-block mb-1">Task ID</small>
                <code>{task._id}</code>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block mb-1">Department</small>
                <strong>{task.assignedTo.department || 'N/A'}</strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block mb-1">Designation</small>
                <strong>{task.assignedTo.designation || 'N/A'}</strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block mb-1">Last Updated</small>
                <strong>{formatDateTime(task.updatedAt)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} title="Edit Task" size="lg">
        <form>
          <div className="mb-3">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={editFormData.title}
              onChange={handleEditChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              value={editFormData.description}
              onChange={handleEditChange}
              required
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Assign To</label>
              <select
                className="form-select"
                name="assignedTo"
                value={editFormData.assignedTo}
                onChange={handleEditChange}
                required
              >
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                name="priority"
                value={editFormData.priority}
                onChange={handleEditChange}
                required
              >
                <option value={TASK_PRIORITY.LOW}>Low</option>
                <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                <option value={TASK_PRIORITY.HIGH}>High</option>
                <option value={TASK_PRIORITY.URGENT}>Urgent</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={editFormData.status}
                onChange={handleEditChange}
                required
              >
                <option value={TASK_STATUS.PENDING}>Pending</option>
                <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                <option value={TASK_STATUS.COMPLETED}>Completed</option>
                <option value={TASK_STATUS.ON_HOLD}>On Hold</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                name="dueDate"
                value={editFormData.dueDate}
                onChange={handleEditChange}
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowEditModal(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary-custom"
              onClick={handleUpdateTask}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                'Update Task'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskDetails;