import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUserRole } from '../../services/userService';
import Loader from '../common/Loader';
import Modal from '../common/Modal';
import { formatDate, getRoleBadgeClass, getInitials } from '../../utils/helpers';
import { ROLE_LABELS, USER_ROLES } from '../../utils/constants';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    try {
      await deleteUser(userId);
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowModal(true);
  };

  const handleUpdateRole = async () => {
    if (!newRole || newRole === selectedUser.role) {
      alert('Please select a different role');
      return;
    }

    try {
      setProcessing(true);
      await updateUserRole(selectedUser._id, newRole);
      alert('User role updated successfully!');
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    } finally {
      setProcessing(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === 'all') return true;
    if (filter === 'approved') return user.isApproved === true;
    if (filter === 'pending') return user.isApproved === false;
    return user.role === filter;
  });

  if (loading) {
    return <Loader message="Loading users..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">
            <i className="bi bi-people me-2"></i>
            User Management
          </h1>
          <p className="page-subtitle">Manage all users and their roles</p>
        </div>
      </div>

      <div className="container">
        {/* Filter Buttons */}
        <div className="card-custom mb-4">
          <div className="d-flex gap-2 flex-wrap">
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              All Users ({users.length})
            </button>
            <button
              className={`btn ${filter === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('approved')}
            >
              Approved ({users.filter((u) => u.isApproved).length})
            </button>
            <button
              className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({users.filter((u) => !u.isApproved).length})
            </button>
            <button
              className={`btn ${filter === USER_ROLES.ADMIN ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFilter(USER_ROLES.ADMIN)}
            >
              Admins ({users.filter((u) => u.role === USER_ROLES.ADMIN).length})
            </button>
            <button
              className={`btn ${filter === USER_ROLES.MANAGER ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFilter(USER_ROLES.MANAGER)}
            >
              Managers ({users.filter((u) => u.role === USER_ROLES.MANAGER).length})
            </button>
            <button
              className={`btn ${filter === USER_ROLES.EMPLOYEE ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFilter(USER_ROLES.EMPLOYEE)}
            >
              Employees ({users.filter((u) => u.role === USER_ROLES.EMPLOYEE).length})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="card-custom">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="user-avatar me-2" style={{ width: '2.5rem', height: '2.5rem' }}>
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <strong>{user.name}</strong>
                            <br />
                            <small className="text-muted">{user.designation || 'N/A'}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={getRoleBadgeClass(user.role)}>
                          {ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td>{user.department || 'N/A'}</td>
                      <td>
                        {user.isApproved ? (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Approved
                          </span>
                        ) : (
                          <span className="badge bg-warning">
                            <i className="bi bi-clock me-1"></i>
                            Pending
                          </span>
                        )}
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleOpenRoleModal(user)}
                            title="Change Role"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            title="Delete User"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="empty-state">
                        <i className="bi bi-inbox empty-state-icon"></i>
                        <p>No users found with the selected filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Role Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Update User Role"
        size="md"
      >
        {selectedUser && (
          <div>
            <div className="mb-3">
              <p className="mb-2">
                <strong>User:</strong> {selectedUser.name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="mb-3">
                <strong>Current Role:</strong>{' '}
                <span className={getRoleBadgeClass(selectedUser.role)}>
                  {ROLE_LABELS[selectedUser.role]}
                </span>
              </p>
            </div>

            <div className="mb-3">
              <label className="form-label">Select New Role</label>
              <select
                className="form-select"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value={USER_ROLES.EMPLOYEE}>Employee</option>
                <option value={USER_ROLES.MANAGER}>Manager</option>
                <option value={USER_ROLES.ADMIN}>Admin</option>
              </select>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary-custom"
                onClick={handleUpdateRole}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  'Update Role'
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;