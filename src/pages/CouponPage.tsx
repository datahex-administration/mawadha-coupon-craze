
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CouponCard from '@/components/CouponCard';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CouponPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const couponCode = searchParams.get('code');

  useEffect(() => {
    const fetchUser = async () => {
      if (!couponCode) {
        console.error("No coupon code provided in URL");
        toast.error("No coupon code provided");
        navigate('/coupon-status');
        return;
      }
      
      try {
        console.log("Fetching coupon with code:", couponCode);
        
        // Find user with this coupon code from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('coupon_code', couponCode)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching coupon:", error);
          toast.error("Error fetching coupon");
          setTimeout(() => navigate('/coupon-status'), 2000);
          return;
        }
        
        if (!data) {
          console.error("Coupon not found:", couponCode);
          toast.error("Coupon not found");
          setTimeout(() => navigate('/coupon-status'), 2000);
          return;
        }
        
        console.log("Coupon found:", data);
        
        // Convert Supabase snake_case to camelCase for our frontend types
        const userData: User = {
          id: data.id,
          name: data.name,
          whatsapp: data.whatsapp,
          countryCode: data.country_code,
          age: data.age,
          maritalStatus: data.marital_status as 'Single' | 'Engaged' | 'Married',
          attractionReason: data.attraction_reason,
          couponCode: data.coupon_code,
          createdAt: data.created_at
        };
        
        setUser(userData);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong");
        setTimeout(() => navigate('/coupon-status'), 2000);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [couponCode, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-mawadha-primary to-purple-700">
        <div className="text-white text-xl animate-pulse flex items-center space-x-2">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          <span className="ml-2">Loading your coupon...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-mawadha-primary to-purple-700">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Coupon not found</h2>
          <p className="mb-6">We couldn't find your coupon. Please check your registration status.</p>
          <Button 
            onClick={() => navigate('/coupon-status')}
            className="bg-white text-mawadha-primary hover:bg-white/90 mb-3"
          >
            Find Your Coupon
          </Button>
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            Register Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: `linear-gradient(135deg, #b71c8d 0%, #800060 100%)`,
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
      
      <div className="text-center text-white mb-6 animate-fade-in">
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
    </div>
  );
};

export default CouponPage;
