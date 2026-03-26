import React, { useState } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('adminToken')));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="admin-page-container" style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
      <div className="container">
        {isAuthenticated ? (
          <AdminDashboard />
        ) : (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        )}

      </div>
    </div>
  );
};

export default AdminPage;
