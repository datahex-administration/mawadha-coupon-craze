
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <img 
        src="/lovable-uploads/bf2aa2fe-7828-4fe3-92cc-cd036483a18f.png" 
        alt="Mawadha Logo" 
        className="w-32 md:w-40 mb-2" 
      />
      <h2 className="text-white text-xs md:text-sm">Be a better half</h2>
    </div>
  );
};

export default Logo;
