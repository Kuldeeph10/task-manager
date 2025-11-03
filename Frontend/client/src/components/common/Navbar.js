import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <Link to="/dashboard" className="navbar-brand-custom">
          <i className="bi bi-clipboard-check-fill"></i>
          <span>TaskManager</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link-custom">
                <i className="bi bi-house-door"></i>
                Dashboard
              </Link>
            </li>

            {(user?.role === 'admin' || user?.role === 'manager') && (
              <li className="nav-item">
                <Link to="/tasks" className="nav-link-custom">
                  <i className="bi bi-list-task"></i>
                  All Tasks
                </Link>
              </li>
            )}

            {user?.role === 'employee' && (
              <li className="nav-item">
                <Link to="/my-tasks" className="nav-link-custom">
                  <i className="bi bi-clipboard-check"></i>
                  My Tasks
                </Link>
              </li>
            )}

            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link to="/users" className="nav-link-custom">
                  <i className="bi bi-people"></i>
                  Users
                </Link>
              </li>
            )}

            <li className="nav-item dropdown">
              <div
                className="user-dropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="user-avatar">{getInitials(user?.name)}</div>
                <div className="user-info d-none d-lg-block">
                  <h6>{user?.name}</h6>
                  <p>{user?.role}</p>
                </div>
                <i className="bi bi-chevron-down"></i>
              </div>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link to="/profile" className="dropdown-item">
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;