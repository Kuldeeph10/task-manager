import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../../services/taskService';
import { getEmployees } from '../../services/userService';
import Loader from '../common/Loader';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Task description is required');
      return;
    }

    if (!formData.assignedTo) {
      setError('Please assign the task to an employee');
      return;
    }

    if (!formData.dueDate) {
      setError('Due date is required');
      return;
    }

    try {
      setSubmitting(true);
      await createTask(formData);
      alert('Task created successfully!');
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading employees..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">
            <i className="bi bi-plus-circle me-2"></i>
            Create New Task
          </h1>
          <p className="page-subtitle">Assign a new task to your team member</p>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card-custom">
              {error && (
                <div className="alert alert-custom alert-danger mb-4">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    Task Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="5"
                    placeholder="Describe the task in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label htmlFor="assignedTo" className="form-label">
                      Assign To *
                    </label>
                    <select
                      className="form-select"
                      id="assignedTo"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select an employee</option>
                      {employees.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.name} - {employee.designation || 'Employee'}
                        </option>
                      ))}
                    </select>
                    {employees.length === 0 && (
                      <small className="text-muted">
                        No approved employees found. Please ask admin to approve employees first.
                      </small>
                    )}
                  </div>

                  <div className="col-md-6 mb-4">
                    <label htmlFor="priority" className="form-label">
                      Priority *
                    </label>
                    <select
                      className="form-select"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-4">
                    <label htmlFor="dueDate" className="form-label">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/tasks')}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary-custom"
                    disabled={submitting || employees.length === 0}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating Task...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Task
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;