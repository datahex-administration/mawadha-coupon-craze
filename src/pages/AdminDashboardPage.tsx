
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '@/components/AdminDashboard';

const AdminDashboardPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if admin is authenticated using localStorage
    const adminAuthenticated = localStorage.getItem('mawadhaAdminAuthenticated');
    if (adminAuthenticated === 'true') {
      setIsAuthenticated(true);
    } else {
      // Redirect to admin login page if not authenticated
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('mawadhaAdminAuthenticated');
    // Redirect to admin login page
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard 
        isAuthenticated={isAuthenticated} 
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default AdminDashboardPage;
