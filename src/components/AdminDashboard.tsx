import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [luckyWinner, setLuckyWinner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('mawadhaAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    fetchUsers();
  }, [navigate, currentPage]);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Get the total count first for pagination
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error counting users:', countError);
        toast.error('Failed to load user data');
        return;
      }
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      }
      
      // Now get the actual data for the current page
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load user data');
        return;
      }
      
      if (data) {
        // Convert snake_case to camelCase for frontend
        const formattedUsers: User[] = data.map(user => ({
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
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('mawadhaAdminAuthenticated');
    navigate('/admin');
  };
  
  const conductLuckyDraw = async () => {
    if (users.length === 0) {
      toast.error('No participants available for lucky draw');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get total count for random selection
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (countError || count === null) {
        throw new Error('Could not count participants');
      }
      
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * count);
      
      // Get the user at that random index
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .range(randomIndex, randomIndex);
      
      if (error || !data || data.length === 0) {
        throw new Error('Could not select a winner');
      }
      
      // Format the winner data
      const winner = {
        id: data[0].id,
        name: data[0].name,
        whatsapp: data[0].whatsapp,
        countryCode: data[0].country_code,
        age: data[0].age,
        maritalStatus: data[0].marital_status as 'Single' | 'Engaged' | 'Married',
        attractionReason: data[0].attraction_reason,
        couponCode: data[0].coupon_code,
        createdAt: data[0].created_at
      };
      
      setLuckyWinner(winner);
      toast.success('Winner selected successfully!');
      
    } catch (error) {
      console.error('Lucky draw error:', error);
      toast.error('Failed to select a winner');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTermLower) ||
      user.couponCode.toLowerCase().includes(searchTermLower) ||
      `${user.countryCode}${user.whatsapp}`.includes(searchTermLower)
    );
  });
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-mawadha-primary">Mawadha Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline" className="text-mawadha-primary border-mawadha-primary">
          Logout
        </Button>
      </div>
      
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
              Total Participants: <span className="font-bold">{users.length}</span>
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
                  <TableHead>Coupon Code</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Loading participants...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow 
                      key={user.couponCode}
                      onClick={() => setSelectedUser(user)}
                      className="cursor-pointer hover:bg-muted"
                    >
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.countryCode} {user.whatsapp}</TableCell>
                      <TableCell>{user.age}</TableCell>
                      <TableCell>{user.maritalStatus}</TableCell>
                      <TableCell className="font-mono">{user.couponCode}</TableCell>
                      <TableCell>{new Date(user.createdAt || '').toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      {users.length === 0 ? "No participants yet" : "No matching results"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {!searchTerm && totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
          <Card className="bg-white border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-mawadha-primary to-purple-700 text-white text-center py-6">
              <CardTitle className="text-2xl font-bold">
                Lucky Draw Selection
              </CardTitle>
              <p className="text-white/90">
                Randomly select a winner from all participants
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <p className="mb-8 text-center text-muted-foreground">
                Click the button below to randomly select a winner from {totalPages > 1 ? "all" : ""} participants.
              </p>
              
              <div className="flex justify-center">
                <Button
                  onClick={conductLuckyDraw}
                  className="bg-mawadha-primary hover:bg-mawadha-dark relative overflow-hidden group"
                  size="lg"
                  disabled={isLoading || users.length === 0}
                >
                  <span className="relative z-10">
                    {isLoading ? "Selecting..." : "Select Winner"}
                  </span>
                  <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
              </div>
              
              {luckyWinner && (
                <div className="mt-12 animate-fade-in">
                  <div className="relative p-1 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                    <div className="bg-white p-6 rounded-lg">
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-mawadha-secondary text-white text-lg font-bold py-2 px-6 rounded-full">
                        Winner!
                      </div>
                      <div className="text-center mt-4">
                        <h3 className="text-2xl font-bold text-mawadha-primary">{luckyWinner.name}</h3>
                        <p className="text-muted-foreground">{luckyWinner.countryCode} {luckyWinner.whatsapp}</p>
                        <div className="mt-4 p-3 bg-gradient-to-r from-mawadha-primary to-purple-700 text-white rounded-md font-mono text-lg tracking-wider">
                          {luckyWinner.couponCode}
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                          Registration Date: {new Date(luckyWinner.createdAt || '').toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="text-sm text-center text-muted-foreground">
            Total entries in lucky draw: {users.length}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
