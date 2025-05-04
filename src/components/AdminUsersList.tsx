
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AdminUsersListProps {
  isAuthenticated: boolean;
}

const AdminUsersList: React.FC<AdminUsersListProps> = ({ isAuthenticated }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchUsers = async () => {
      setLoading(true);
      try {
        console.log("Fetching users for admin panel, page:", currentPage);
        
        // First, get total count
        const { count: totalUsers, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.error("Error fetching count:", countError);
          toast.error("Error fetching users count");
          return;
        }
        
        if (totalUsers !== null) {
          setTotalCount(totalUsers);
          console.log("Total users count:", totalUsers);
        }
        
        // Fetch paginated users - this time without RLS restrictions
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
          .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);
          
        if (error) {
          console.error("Error fetching users:", error);
          toast.error("Error fetching users");
          return;
        }
        
        if (data) {
          console.log("Fetched users data:", data);
          const formattedUsers = data.map(user => ({
            id: user.id,
            name: user.name,
            whatsapp: user.whatsapp,
            countryCode: user.country_code,
            age: user.age,
            maritalStatus: user.marital_status as 'Single' | 'Engaged' | 'Married',
            attractionReason: user.attraction_reason,
            couponCode: user.coupon_code,
            createdAt: user.created_at
          }));
          setUsers(formattedUsers);
        } else {
          console.log("No users data returned");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [isAuthenticated, currentPage]);
  
  const goToNextPage = () => {
    if ((currentPage + 1) * pageSize < totalCount) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mawadha-primary"></div>
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No participants yet</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          Registered Users 
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Total: {totalCount})
          </span>
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Coupon Code</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.countryCode} {user.whatsapp}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.maritalStatus}</TableCell>
                <TableCell className="font-mono">{user.couponCode}</TableCell>
                <TableCell>
                  {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalCount)} of {totalCount}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              if (currentPage > 0) {
                setCurrentPage(currentPage - 1);
              }
            }} 
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              if ((currentPage + 1) * pageSize < totalCount) {
                setCurrentPage(currentPage + 1);
              }
            }} 
            disabled={(currentPage + 1) * pageSize >= totalCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersList;
