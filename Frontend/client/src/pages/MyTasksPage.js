import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import MyTasks from '../components/employee/MyTasks';
import TaskDetails from '../components/manager/TaskDetails';

const MyTasksPage = () => {
  const { id } = useParams();

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
              {id ? <TaskDetails /> : <MyTasks />}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyTasksPage;