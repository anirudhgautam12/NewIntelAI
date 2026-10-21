import React from 'react';
import Loader from './Loader.jsx';

/**
 * Centered page-level loading state with message
 */
const PageLoader = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] w-full gap-4 ${className}`}>
      <Loader size="lg" />
      {message && (
        <p className="text-sm font-medium text-gray-400 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default PageLoader;
