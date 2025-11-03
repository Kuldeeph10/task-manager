import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateTaskStatus } from '../../services/taskService';
import Modal from '../common/Modal';
import {
  formatDate,
  getStatusBadgeClass,
  getPriorityBadgeClass,
  isOverdue,
} from '../../utils/helpers';
import { STATUS_LABELS, PRIORITY_LABELS, TASK_STATUS } from '../../utils/constants';

const TaskCard = ({ task, onUpdate }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState(task.status);
  const [updating, setUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    if (newStatus === task.status) {
      alert('Please select a different status');
      return;
    }

    try {
      setUpdating(true);
      await updateTaskStatus(task._id, newStatus);
      alert('Task status updated successfully!');
      setShowStatusModal(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update task status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className={`task-card priority-${task.priority}`}>
        <div className="task-header">
          <div>
            <h5 className="task-title">{task.title}</h5>
            <div className="task-badges">
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
        </div>

        <p className="task-description">{task.description}</p>

        <div className="task-meta">
          <div className="task-meta-item">
            <i className="bi bi-person"></i>
            <span>Assigned by: {task.assignedBy?.name}</span>
          </div>
          <div className="task-meta-item">
            <i className="bi bi-calendar"></i>
            <span
              className={
                isOverdue(task.dueDate) && task.status !== TASK_STATUS.COMPLETED
                  ? 'text-danger fw-bold'
                  : ''
              }
            >
              Due: {formatDate(task.dueDate)}
            </span>
          </div>
          <div className="task-meta-item">
            <i className="bi bi-clock"></i>
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
        </div>

        <div className="task-actions">
          <Link to={`/my-tasks/${task._id}`} className="btn btn-sm btn-primary-custom">
            <i className="bi bi-eye me-1"></i>
            View Details
          </Link>
          <button
            className="btn btn-sm btn-secondary-custom"
            onClick={() => setShowStatusModal(true)}
          >
            <i className="bi bi-arrow-repeat me-1"></i>
            Update Status
          </button>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        title="Update Task Status"
        size="md"
      >
        <div>
          <p className="mb-3">
            <strong>Task:</strong> {task.title}
          </p>
          <p className="mb-3">
            <strong>Current Status:</strong>{' '}
            <span className={getStatusBadgeClass(task.status)}>{STATUS_LABELS[task.status]}</span>
          </p>

          <div className="mb-4">
            <label className="form-label">Select New Status</label>
            <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value={TASK_STATUS.PENDING}>Pending</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.COMPLETED}>Completed</option>
              <option value={TASK_STATUS.ON_HOLD}>On Hold</option>
            </select>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button
              className="btn btn-secondary"
              onClick={() => setShowStatusModal(false)}
              disabled={updating}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary-custom"
              onClick={handleUpdateStatus}
              disabled={updating}
            >
              {updating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskCard;