
import React, { useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if admin is already logged in
    const isAuthenticated = localStorage.getItem('mawadhaAdminAuthenticated') === 'true';
    if (isAuthenticated) {
      // Redirect to dashboard if already authenticated
      navigate('/admin/dashboard');
    }
  }, [navigate]);
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(to right, #b71c8d, #800060)`,
      }}
    >
      <AdminLogin />
    </div>
  );
};

export default AdminPage;
