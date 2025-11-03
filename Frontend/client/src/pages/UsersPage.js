import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import UserManagement from '../components/admin/UserManagement';

const UsersPage = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 p-0">
            <Sidebar />
          </div>
          <div className="col-lg-10">
            <main className="main-content">
              <UserManagement />
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UsersPage;