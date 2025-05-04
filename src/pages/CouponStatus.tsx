
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCodes, validatePhoneNumber } from '@/utils/countryCodes';

const CouponStatus: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  
  // Get the format for the selected country
  const selectedCountry = countryCodes.find(c => c.code === countryCode);
  const phoneFormat = selectedCountry?.format || 'XXXX XXXX';

  const handleSearch = async () => {
    setIsSearching(true);
    console.log("Searching for:", { countryCode, phoneNumber });
    
    // Simple validation for phone format
    if (phoneNumber.trim().length < 5) {
      toast.error('Please enter a valid phone number');
      setIsSearching(false);
      return;
    }
    
    // Validate phone number based on country code
    if (!validatePhoneNumber(phoneNumber, countryCode)) {
      toast.error(`Invalid phone number format for ${selectedCountry?.country || 'selected country'}`);
      setIsSearching(false);
      return;
    }
    
    try {
      // Trim and clean the phone number to remove spaces
      const trimmedPhoneNumber = phoneNumber.trim();
      console.log(`Searching for user with country_code=${countryCode}, whatsapp=${trimmedPhoneNumber}`);
      
      // Query the database for the coupon
      const { data, error } = await supabase
        .from('users')
        .select('coupon_code, name')
        .eq('country_code', countryCode)
        .eq('whatsapp', trimmedPhoneNumber)
        .maybeSingle();
        
      console.log("Search result:", data, error);
      
      if (error) {
        console.error('Error searching for coupon:', error);
        toast.error('An error occurred while searching');
        setIsSearching(false);
        return;
      }
      
      if (data) {
        // User found, redirect to their coupon
        toast.success(`Coupon found for ${data.name || 'your number'}!`);
        // Navigate immediately without delay
        navigate(`/coupon?code=${data.coupon_code}`);
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
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Your Country Code
              </label>
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country code" />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.country} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
              <p className="text-xs text-gray-500 mt-1">
                Format: {phoneFormat}
              </p>
            </div>
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
