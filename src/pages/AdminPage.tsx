
import React, { useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import { useNavigate, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: `linear-gradient(to right, #b71c8d, #800060)`,
      }}
    >
      <AdminLogin />
      
      <div className={`mt-4 text-center w-full p-4 ${isMobile ? 'pb-4' : ''}`}>
        <a 
          href="https://datahex.co" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white font-medium hover:text-white/80 transition-colors"
        >
          Powered by DataHex
        </a>
      </div>
    </div>
  );
};

export default AdminPage;
