import React, { useState, useEffect } from 'react';
import { getPendingUsers, approveUser, deleteUser } from '../../services/userService';
import Loader from '../common/Loader';
import { formatDate, getRoleBadgeClass } from '../../utils/helpers';
import { ROLE_LABELS } from '../../utils/constants';

const PendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await getPendingUsers();
      setPendingUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      alert('Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this user?')) {
      return;
    }

    try {
      setProcessing(userId);
      await approveUser(userId);
      alert('User approved successfully!');
      fetchPendingUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject and delete this user?')) {
      return;
    }

    try {
      setProcessing(userId);
      await deleteUser(userId);
      alert('User rejected successfully!');
      fetchPendingUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <Loader message="Loading pending approvals..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">
            <i className="bi bi-person-check me-2"></i>
            Pending User Approvals
          </h1>
          <p className="page-subtitle">Review and approve new user registrations</p>
        </div>
      </div>

      <div className="container">
        {pendingUsers.length > 0 ? (
          <div className="card-custom">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Phone</th>
                    <th>Registered On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="user-avatar me-2" style={{ width: '2rem', height: '2rem', fontSize: '0.875rem' }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={getRoleBadgeClass(user.role)}>
                          {ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td>{user.department || 'N/A'}</td>
                      <td>{user.designation || 'N/A'}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApprove(user._id)}
                            disabled={processing === user._id}
                          >
                            {processing === user._id ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-1"></i>
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReject(user._id)}
                            disabled={processing === user._id}
                          >
                            {processing === user._id ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <>
                                <i className="bi bi-x-circle me-1"></i>
                                Reject
                              </>
                            )}
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
              <i className="bi bi-check-circle empty-state-icon"></i>
              <h5>No Pending Approvals</h5>
              <p>All user registrations have been reviewed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;