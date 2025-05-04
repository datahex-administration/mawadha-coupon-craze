
import React from 'react';
import { Button } from "@/components/ui/button";
import AdminUsersList from './AdminUsersList';

interface AdminDashboardProps {
  isAuthenticated: boolean;
  handleLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isAuthenticated, handleLogout }) => {
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-mawadha-primary">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      
      <div className="grid gap-6">
        <AdminUsersList isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
};

export default AdminDashboard;
