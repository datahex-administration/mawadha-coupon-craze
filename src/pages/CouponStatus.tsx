
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const CouponStatus: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simple validation for phone format
    if (phoneNumber.trim().length < 5) {
      toast.error('Please enter a valid phone number');
      setIsSearching(false);
      return;
    }
    
    try {
      // Clean up the phone number for search (remove spaces, dashes, etc.)
      const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
      
      // Search for user by phone number in Supabase
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .ilike('whatsapp', `%${cleanPhone}%`);
      
      if (error) {
        console.error('Error searching for coupon:', error);
        toast.error('An error occurred while searching');
        setIsSearching(false);
        return;
      }
      
      // User found, redirect to their coupon
      if (users && users.length > 0) {
        toast.success('Coupon found!');
        setTimeout(() => {
          navigate(`/coupon?code=${users[0].coupon_code}`);
        }, 1000);
      } else {
        toast.error('No coupon found for this phone number');
      }
    } catch (error) {
      console.error('Error searching for coupon:', error);
      toast.error('An error occurred while searching');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: `linear-gradient(to right, #b71c8d, #800060)`,
      }}
    >
      <div className="w-full max-w-md bg-white/80 rounded-lg shadow-lg p-8 text-center">
        <img 
          src="/lovable-uploads/bf2aa2fe-7828-4fe3-92cc-cd036483a18f.png" 
          alt="Mawadha Logo" 
          className="w-24 mx-auto mb-4" 
        />
        
        <h1 className="text-2xl font-bold text-mawadha-primary mb-6">
          Find Your Coupon
        </h1>
        
        <div className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Your Phone Number
            </label>
            <Input
              type="text"
              placeholder="Your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full bg-mawadha-primary hover:bg-mawadha-dark"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Find My Coupon'}
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
            className="w-full text-mawadha-primary"
          >
            Back to Registration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CouponStatus;
