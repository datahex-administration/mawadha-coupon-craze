import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CouponCard from '@/components/CouponCard';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const CouponPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const couponCode = searchParams.get('code');
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUser = async () => {
      if (!couponCode) {
        console.error('No coupon code provided in URL');
        toast.error('Coupon code is missing');
        navigate('/');
        return;
      }
      
      try {
        console.log("Fetching user data for coupon code:", couponCode);
        
        // Fetch user with this coupon code from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('coupon_code', couponCode)
          .single();
        
        if (error) {
          console.error('Error fetching user:', error);
          toast.error('Could not find your coupon');
          navigate('/');
          return;
        }
        
        if (!data) {
          // Invalid coupon code
          console.error('No data found for coupon code:', couponCode);
          toast.error('Invalid coupon code');
          navigate('/');
          return;
        }
        
        console.log("Found user data:", data);
        
        // Map the Supabase data format to our User type
        const userData: User = {
          id: data.id,
          name: data.name,
          whatsapp: data.whatsapp,
          countryCode: data.country_code,
          age: data.age,
          maritalStatus: data.marital_status as 'Single' | 'Engaged' | 'Married',
          attractionReason: data.attraction_reason,
          couponCode: data.coupon_code,
          createdAt: data.created_at,
        };
        
        setUser(userData);
      } catch (error) {
        console.error('Error in coupon page:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [couponCode, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mawadha-primary">
        <div className="text-white">Loading your coupon...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mawadha-primary">
        <div className="text-white">Coupon not found</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: `linear-gradient(to right, #b71c8d, #800060)`,
        backgroundSize: 'cover',
        position: 'relative',
      }}
    >
      {/* Background sparkles */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `shimmer ${Math.random() * 3 + 2}s infinite alternate`,
              transform: `scale(${Math.random() * 0.8 + 0.2})`,
            }}
          />
        ))}
      </div>
      
      <div className="text-center text-white mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Your Gift Voucher is Ready!</h1>
        <p className="text-mawadha-light mt-2">
          Congratulations {user.name}! Here is your coupon for the lucky draw.
        </p>
      </div>
      
      <CouponCard couponCode={user.couponCode} />
      
      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="border-white text-white hover:bg-white/10"
        >
          Back to Home
        </Button>
      </div>
      
      <div className={`mt-4 text-center w-full fixed bottom-0 p-2 ${isMobile ? 'flex flex-col gap-1' : 'flex justify-between items-center'}`}>
        <div className={`${isMobile ? 'mb-1' : 'w-20'}`}>
          <a 
            href="https://datahex.co" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white font-medium hover:text-blue-300 transition-colors"
          >
            Powered by DataHex
          </a>
        </div>
      </div>
    </div>
  );
};

export default CouponPage;
