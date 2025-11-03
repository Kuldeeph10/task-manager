import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-card text-center">
        <div className="empty-state">
          <i className="bi bi-exclamation-triangle empty-state-icon" style={{ fontSize: '5rem', color: 'var(--warning)' }}></i>
          <h2 style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--dark)' }}>404</h2>
          <h5>Page Not Found</h5>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <Link to="/dashboard" className="btn btn-primary-custom mt-3">
            <i className="bi bi-house-door me-2"></i>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;