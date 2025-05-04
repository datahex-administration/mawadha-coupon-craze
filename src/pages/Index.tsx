
import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '@/components/RegistrationForm';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6"
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
      
      <div className="absolute top-4 right-4">
        <Link 
          to="/admin" 
          className="text-white/70 text-xs hover:text-white transition-colors"
        >
          Admin
        </Link>
      </div>
      
      <div className="text-center mb-4 md:mb-6">
        <img 
          src="/lovable-uploads/bf2aa2fe-7828-4fe3-92cc-cd036483a18f.png" 
          alt="Mawadha Logo" 
          className="w-28 md:w-40 mx-auto mb-2 md:mb-4" 
        />
        <h1 className="text-white text-2xl md:text-4xl font-bold mb-1 md:mb-2">MAWADHA</h1>
        <h2 className="text-white text-base md:text-xl mb-2 md:mb-4">Be a better half</h2>
        <div className="bg-mawadha-secondary text-white inline-block px-4 py-1 md:px-6 md:py-2 rounded-md mb-2 md:mb-4">
          <h3 className="text-sm md:text-lg font-bold">GIFT VOUCHER GIVEAWAY</h3>
        </div>
        <div className="mt-2">
          <a 
            href="https://www.mawadha.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white text-xs md:text-sm hover:text-blue-200 transition-colors underline"
          >
            Visit www.mawadha.com
          </a>
        </div>
      </div>
      
      <RegistrationForm />
      
      <div className="mt-4 text-center w-full p-2 md:p-4">
        <a 
          href="https://datahex.co" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white font-medium text-xs hover:text-blue-300 transition-colors"
        >
          Powered by DataHex
        </a>
      </div>
    </div>
  );
};

export default Index;
