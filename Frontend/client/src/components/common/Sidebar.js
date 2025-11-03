import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard')}`}>
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {user?.role === 'admin' && (
          <>
            <li>
              <Link to="/users" className={`sidebar-link ${isActive('/users')}`}>
                <i className="bi bi-people"></i>
                <span>User Management</span>
              </Link>
            </li>
            <li>
              <Link to="/pending-approvals" className={`sidebar-link ${isActive('/pending-approvals')}`}>
                <i className="bi bi-person-check"></i>
                <span>Pending Approvals</span>
              </Link>
            </li>
            <li>
              <Link to="/tasks" className={`sidebar-link ${isActive('/tasks')}`}>
                <i className="bi bi-list-task"></i>
                <span>All Tasks</span>
              </Link>
            </li>
          </>
        )}

        {user?.role === 'manager' && (
          <>
            <li>
              <Link to="/tasks" className={`sidebar-link ${isActive('/tasks')}`}>
                <i className="bi bi-list-task"></i>
                <span>All Tasks</span>
              </Link>
            </li>
            <li>
              <Link to="/create-task" className={`sidebar-link ${isActive('/create-task')}`}>
                <i className="bi bi-plus-circle"></i>
                <span>Create Task</span>
              </Link>
            </li>
          </>
        )}

        {user?.role === 'employee' && (
          <>
            <li>
              <Link to="/my-tasks" className={`sidebar-link ${isActive('/my-tasks')}`}>
                <i className="bi bi-clipboard-check"></i>
                <span>My Tasks</span>
              </Link>
            </li>
          </>
        )}

        <li>
          <Link to="/profile" className={`sidebar-link ${isActive('/profile')}`}>
            <i className="bi bi-person-circle"></i>
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;