
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [luckyWinner, setLuckyWinner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;
  
  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('mawadhaAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    // Load user data from Supabase
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching users from Supabase...');
        
        // First, get the total count for pagination
        const countResponse = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        if (countResponse.error) {
          console.error('Error counting users:', countResponse.error);
          toast.error('Error loading participant count');
          return;
        }
        
        const totalCount = countResponse.count || 0;
        setTotalUsers(totalCount);
        setTotalPages(Math.ceil(totalCount / usersPerPage));
        
        // Now fetch the current page
        const start = (currentPage - 1) * usersPerPage;
        const end = start + usersPerPage - 1;
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
          .range(start, end);
        
        if (error) {
          console.error('Error fetching users:', error);
          toast.error('Error loading participants data');
          return;
        }
        
        console.log(`Fetched ${data?.length} users for page ${currentPage}`);
        
        if (data) {
          // Map Supabase data format to our User type
          const formattedUsers: User[] = data.map(user => ({
            id: user.id,
            name: user.name,
            whatsapp: user.whatsapp,
            countryCode: user.country_code,
            age: user.age,
            maritalStatus: user.marital_status as 'Single' | 'Engaged' | 'Married',
            attractionReason: user.attraction_reason,
            couponCode: user.coupon_code,
            createdAt: user.created_at,
          }));
          
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error loading participants data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [navigate, currentPage]);
  
  const handleLogout = () => {
    localStorage.removeItem('mawadhaAdminAuthenticated');
    navigate('/admin');
  };
  
  const conductLuckyDraw = () => {
    if (users.length === 0) {
      toast.error('No participants for lucky draw');
      return;
    }
    
    // Random selection for lucky draw
    const winnerIndex = Math.floor(Math.random() * users.length);
    setLuckyWinner(users[winnerIndex]);
    toast.success('Winner selected!');
  };
  
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTermLower) ||
      user.couponCode.toLowerCase().includes(searchTermLower) ||
      `${user.countryCode}${user.whatsapp}`.includes(searchTermLower)
    );
  });
  
  // Handle page changes
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Max number of page links to show
    
    // Always show first page
    pages.push(1);
    
    // Calculate range of pages to show around current page
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
    
    // Adjust if we're near the start
    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    }
    
    // Adjust if we're near the end
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('ellipsis1');
    }
    
    // Add page numbers between ellipses
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('ellipsis2');
    }
    
    // Always show last page if we have more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-mawadha-primary">Mawadha Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline" className="text-mawadha-primary border-mawadha-primary">
          Logout
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse">Loading participants data...</div>
        </div>
      ) : (
        <Tabs defaultValue="participants">
          <TabsList className="mb-4">
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="luckyDraw">Lucky Draw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="participants" className="space-y-4">
            <div className="flex justify-between items-center">
              <Input
                placeholder="Search by name, phone or coupon code..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <div className="text-sm text-muted-foreground">
                Total Participants: <span className="font-bold">{totalUsers}</span>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attraction Reason</TableHead>
                    <TableHead>Coupon Code</TableHead>
                    <TableHead>Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow 
                        key={user.id || user.couponCode}
                        onClick={() => setSelectedUser(user)}
                        className="cursor-pointer hover:bg-muted"
                      >
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.countryCode} {user.whatsapp}</TableCell>
                        <TableCell>{user.age}</TableCell>
                        <TableCell>{user.maritalStatus}</TableCell>
                        <TableCell className="max-w-xs truncate">{user.attractionReason}</TableCell>
                        <TableCell className="font-mono">{user.couponCode}</TableCell>
                        <TableCell>{new Date(user.createdAt || '').toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        {users.length === 0 ? "No participants yet" : "No matching results"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  {/* Previous button */}
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => goToPage(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {/* Page numbers */}
                  {getPageNumbers().map((page, i) => (
                    page === 'ellipsis1' || page === 'ellipsis2' ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={`page-${page}`}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => goToPage(Number(page))}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  ))}
                  
                  {/* Next button */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => goToPage(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            
            {selectedUser && (
              <div className="mt-6 p-4 border rounded-lg bg-muted">
                <h3 className="text-lg font-medium mb-2">Participant Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-semibold">Name:</span> {selectedUser.name}</p>
                    <p><span className="font-semibold">WhatsApp:</span> {selectedUser.countryCode} {selectedUser.whatsapp}</p>
                    <p><span className="font-semibold">Age:</span> {selectedUser.age}</p>
                    <p><span className="font-semibold">Marital Status:</span> {selectedUser.maritalStatus}</p>
                  </div>
                  <div>
                    <p><span className="font-semibold">Coupon Code:</span> {selectedUser.couponCode}</p>
                    <p><span className="font-semibold">Registration Date:</span> {new Date(selectedUser.createdAt || '').toLocaleString()}</p>
                    <p><span className="font-semibold">What attracts to Mawadha:</span></p>
                    <p className="text-sm mt-1">{selectedUser.attractionReason}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedUser(null)}
                  className="mt-2"
                >
                  Close Details
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="luckyDraw" className="space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
              <h2 className="text-xl font-bold text-mawadha-primary mb-4">Lucky Draw Selection</h2>
              <p className="mb-6 text-muted-foreground">
                Click the button below to randomly select a winner from all participants.
              </p>
              
              <Button
                onClick={conductLuckyDraw}
                className="bg-mawadha-primary hover:bg-mawadha-dark"
                size="lg"
                disabled={users.length === 0}
              >
                Select Winner
              </Button>
              
              {luckyWinner && (
                <div className="mt-8 p-6 border-2 border-mawadha-secondary rounded-lg">
                  <div className="text-mawadha-secondary text-2xl font-bold mb-2">Winner!</div>
                  <div className="bg-mawadha-light p-4 rounded-md">
                    <p className="text-xl font-bold">{luckyWinner.name}</p>
                    <p className="text-muted-foreground">{luckyWinner.countryCode} {luckyWinner.whatsapp}</p>
                    <div className="mt-3 inline-block bg-mawadha-primary text-white px-4 py-2 rounded font-mono">
                      {luckyWinner.couponCode}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-sm text-center text-muted-foreground">
              Total entries in lucky draw: {totalUsers}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminDashboard;
