
import React from 'react';
import AdminLogin from '@/components/AdminLogin';

const AdminPage: React.FC = () => {
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
