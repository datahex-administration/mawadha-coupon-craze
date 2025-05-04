
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { User } from '@/types';
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
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('mawadhaAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    // Load user data from localStorage for demo
    const storedUsers = localStorage.getItem('mawadhaUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('mawadhaAdminAuthenticated');
    navigate('/admin');
  };
  
  const conductLuckyDraw = () => {
    if (users.length === 0) {
      return;
    }
    
    // Random selection for lucky draw
    const winnerIndex = Math.floor(Math.random() * users.length);
    setLuckyWinner(users[winnerIndex]);
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
                {filteredUsers.length > 0 ? (
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
            Total entries in lucky draw: {users.length}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
