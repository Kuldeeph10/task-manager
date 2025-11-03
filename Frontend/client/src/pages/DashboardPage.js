import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import AdminDashboard from '../components/admin/AdminDashboard';
import ManagerDashboard from '../components/manager/ManagerDashboard';
import EmployeeDashboard from '../components/employee/EmployeeDashboard';
import '../assets/css/main.css';
import '../assets/css/dashboard.css';

const DashboardPage = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

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
              {renderDashboard()}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;