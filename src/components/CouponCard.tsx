
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import Logo from './Logo';

interface CouponCardProps {
  couponCode: string;
}

const CouponCard: React.FC<CouponCardProps> = ({ couponCode }) => {
  const couponRef = useRef<HTMLDivElement>(null);

  const downloadCoupon = async () => {
    if (couponRef.current) {
      try {
        const canvas = await html2canvas(couponRef.current, {
          scale: 2,
          backgroundColor: null,
        });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `mawadha-coupon-${couponCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error generating coupon image:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-fade-in">
      <div
        ref={couponRef}
        className="w-full rounded-2xl overflow-hidden shadow-2xl mb-8 transform perspective-1200"
      >
        {/* Coupon Header */}
        <div className="bg-gradient-to-r from-mawadha-primary to-purple-700 p-6 text-center relative">
          {/* Background sparkles */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
          </div>
          
          <Logo />
          <h1 className="text-white text-3xl font-bold mb-1 tracking-wide">GIFT VOUCHER</h1>
          <p className="text-mawadha-secondary text-lg font-bold">WORTH ₹25000/-</p>
          <p className="text-white text-sm">FOR 10 PERSONS</p>
        </div>

        {/* Coupon Body */}
        <div className="bg-gradient-to-b from-white to-pink-50 p-6">
          {/* Gold Badge */}
          <div className="relative -mt-16 mb-4">
            <div className="absolute -left-3 bg-gradient-to-r from-yellow-400 to-mawadha-secondary h-1 w-full"></div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-yellow-400 to-mawadha-secondary rounded-full p-8 border-4 border-white shadow-lg relative overflow-hidden">
                {/* Inner sparkle */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8),_transparent_70%)]"></div>
                <div className="text-center relative">
                  <p className="text-white text-sm font-bold">ADDITIONAL VALUE</p>
                  <p className="text-white text-3xl font-bold">100</p>
                  <p className="text-white text-xl font-bold">AED/-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="text-center mt-8">
            <h3 className="text-mawadha-dark font-semibold mb-1">YOUR LUCKY DRAW CODE</h3>
            <div className="bg-gradient-to-r from-mawadha-primary to-purple-700 text-white text-xl font-mono tracking-wider py-3 px-4 rounded-md shadow-inner">
              {couponCode}
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-pink-300"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Validity Till: 31/12/25</p>
                <p className="text-gray-500 text-xs mt-1">T&C Apply*</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-pink-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={downloadCoupon}
        className="bg-gradient-to-r from-mawadha-secondary to-yellow-500 hover:from-yellow-500 hover:to-mawadha-secondary text-white font-bold rounded-full px-8 py-2 transform transition-transform hover:scale-105"
      >
        Download Your Voucher
      </Button>

      <p className="mt-4 text-center text-sm text-mawadha-primary max-w-xs">
        Keep this code safe! It will be used for the lucky draw. You can download the voucher for your records.
      </p>
    </div>
  );
};

export default CouponCard;
