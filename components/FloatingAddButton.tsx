import React from 'react';
import { Link } from 'react-router-dom';

const FloatingAddButton = () => {
  return (
    <Link
      to="/billing"
      className="fixed bottom-8 right-8 bg-gradient-to-br from-deep-purple to-neon-blue text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out z-10"
      aria-label="Create New Bill"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
};

export default React.memo(FloatingAddButton);