
import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '@/components/RegistrationForm';

const Index = () => {
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
      
      <div className="text-center mb-6">
        <img 
          src="/lovable-uploads/bf2aa2fe-7828-4fe3-92cc-cd036483a18f.png" 
          alt="Mawadha Logo" 
          className="w-32 md:w-40 mx-auto mb-4" 
        />
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">MAWADHA</h1>
        <h2 className="text-white text-lg md:text-xl mb-4">Be a better half</h2>
        <div className="bg-mawadha-secondary text-white inline-block px-6 py-2 rounded-md mb-6">
          <h3 className="text-lg font-bold">GIFT VOUCHER GIVEAWAY</h3>
        </div>
      </div>
      
      <RegistrationForm />
      
      <div className="mt-6 text-center text-white text-sm">
        <p>
          Already registered? <Link to="/coupon-status" className="text-mawadha-secondary underline">Check your coupon status</Link>
        </p>
      </div>
      
      {/* Admin button removed as requested */}
    </div>
  );
};

export default Index;
