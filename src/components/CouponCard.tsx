
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileText } from 'lucide-react';
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

  const printCoupon = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-fade-in">
      <div
        ref={couponRef}
        className="w-full bg-white rounded-lg overflow-hidden shadow-xl mb-6 coupon-card"
      >
        {/* Coupon Header */}
        <div className="bg-mawadha-primary p-6 text-center">
          <Logo />
          <h1 className="text-white text-3xl font-bold mb-1">GIFT VOUCHER</h1>
           <div className="bg-mawadha-secondary text-white inline-block px-4 py-1 md:px-6 md:py-2 rounded-md mb-2 md:mb-4">
          <h3 className="text-sm md:text-lg font-bold">AED 100/</h3>
        </div>
         <p className="text-white text-sm mt-4 font-bold">Validity Till: 31/12/25</p>
            <p className="text-white text-xs mt-2 font-bold">T&C Apply*</p>
        </div>

        {/* Coupon Body */}
        <div className="bg-mawadha-cream p-6">
          {/* Gold Badge */}
          

          {/* Coupon Code */}
          <div className="text-center mt-8">
            <h3 className="text-mawadha-dark font-semibold mb-1">YOUR LUCKY DRAW CODE</h3>
            <div className="bg-mawadha-primary text-white text-xl font-mono tracking-wider py-3 px-4 rounded">
              {couponCode}
            </div>
            
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          onClick={downloadCoupon}
          className="bg-mawadha-secondary hover:bg-yellow-600 text-white font-bold flex items-center justify-center gap-2"
        >
          <FileText size={16} />
          Download
        </Button>
        
        <Button
          onClick={printCoupon}
          className="bg-mawadha-primary hover:bg-mawadha-primary/80 text-white font-bold flex items-center justify-center gap-2"
        >
          <Printer size={16} />
          Print Voucher
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-white max-w-xs">
        Keep this code safe! It will be used for the lucky draw. You can download the voucher for your records.
      </p>
    </div>
  );
};

export default CouponCard;
