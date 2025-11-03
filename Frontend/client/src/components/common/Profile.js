import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCurrentUser } from '../../services/authService';
import { updateUserProfile } from '../../services/userService';
import Loader from './Loader';
import {
  formatDate,
  getRoleBadgeClass,
  getInitials,
} from '../../utils/helpers';
import { ROLE_LABELS } from '../../utils/constants';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      setProfileData(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        department: response.data.department || '',
        designation: response.data.designation || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
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
    setSuccess('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setUpdating(true);
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
      };

      const response = await updateUserProfile(updateData);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        updateUser(response.data);
        setProfileData(response.data);
        setEditMode(false);
        fetchProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.currentPassword) {
      setError('Current password is required');
      return;
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setUpdating(true);
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      const response = await updateUserProfile(passwordData);
      
      if (response.success) {
        setSuccess('Password changed successfully!');
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setChangePasswordMode(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      name: profileData.name || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
      department: profileData.department || '',
      designation: profileData.designation || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess('');
  };

  const handleCancelPasswordChange = () => {
    setChangePasswordMode(false);
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return <Loader message="Loading profile..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">
            <i className="bi bi-person-circle me-2"></i>
            My Profile
          </h1>
          <p className="page-subtitle">View and manage your account information</p>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* Profile Card */}
          <div className="col-lg-4 mb-4">
            <div className="card-custom text-center">
              <div
                className="user-avatar mx-auto mb-3"
                style={{
                  width: '120px',
                  height: '120px',
                  fontSize: '3rem',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                }}
              >
                {getInitials(profileData?.name)}
              </div>
              <h4 className="mb-2">{profileData?.name}</h4>
              <p className="text-muted mb-3">{profileData?.email}</p>
              <span className={`${getRoleBadgeClass(profileData?.role)} mb-3 d-inline-block`}>
                <i className="bi bi-shield-check me-1"></i>
                {ROLE_LABELS[profileData?.role]}
              </span>

              <div className="mt-4 pt-4 border-top">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Status:</span>
                  <span className="badge bg-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Active
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Member Since:</span>
                  <strong>{formatDate(profileData?.createdAt)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Last Updated:</span>
                  <strong>{formatDate(profileData?.updatedAt)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="col-lg-8">
            {/* Success/Error Messages */}
            {error && (
              <div className="alert alert-custom alert-danger mb-4">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-custom alert-success mb-4">
                <i className="bi bi-check-circle me-2"></i>
                {success}
              </div>
            )}

            {/* Personal Information Section */}
            <div className="card-custom mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">
                  <i className="bi bi-person-lines-fill me-2"></i>
                  Personal Information
                </h5>
                {!editMode && (
                  <button
                    className="btn btn-sm btn-primary-custom"
                    onClick={() => setEditMode(true)}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Edit Profile
                  </button>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        disabled
                        style={{ backgroundColor: '#f5f5f5' }}
                      />
                      <small className="text-muted">Email cannot be changed</small>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Enter department"
                      />
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Enter designation"
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                      disabled={updating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary-custom"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Full Name</label>
                    <p className="mb-0 fw-semibold">{profileData?.name || 'N/A'}</p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Email Address</label>
                    <p className="mb-0 fw-semibold">{profileData?.email || 'N/A'}</p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Phone Number</label>
                    <p className="mb-0 fw-semibold">
                      {profileData?.phone || 'Not provided'}
                    </p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Department</label>
                    <p className="mb-0 fw-semibold">
                      {profileData?.department || 'Not provided'}
                    </p>
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="text-muted small">Designation</label>
                    <p className="mb-0 fw-semibold">
                      {profileData?.designation || 'Not provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Security Section */}
            <div className="card-custom">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">
                  <i className="bi bi-shield-lock me-2"></i>
                  Security Settings
                </h5>
                {!changePasswordMode && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setChangePasswordMode(true)}
                  >
                    <i className="bi bi-key me-1"></i>
                    Change Password
                  </button>
                )}
              </div>

              {changePasswordMode ? (
                <form onSubmit={handleChangePassword}>
                  <div className="mb-3">
                    <label className="form-label">Current Password *</label>
                    <div className="input-group">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="form-control"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        <i className={`bi ${showCurrentPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password *</label>
                    <div className="input-group">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="form-control"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password (min 6 characters)"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm New Password *</label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="alert alert-custom alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Password must be at least 6 characters long.
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancelPasswordChange}
                      disabled={updating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary-custom"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Changing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-check me-2"></i>
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="d-flex align-items-center text-muted">
                    <i className="bi bi-lock-fill me-2" style={{ fontSize: '1.5rem' }}></i>
                    <div>
                      <p className="mb-1 fw-semibold">Password</p>
                      <small>Last changed: {formatDate(profileData?.updatedAt)}</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;