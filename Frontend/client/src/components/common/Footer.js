import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-custom">
      <div className="container">
        <p>
          &copy; {currentYear} Office Task Manager. All rights reserved. Built with{' '}
          <i className="bi bi-heart-fill text-danger"></i> for efficient task management.
        </p>
      </div>
    </footer>
  );
};

export default Footer;