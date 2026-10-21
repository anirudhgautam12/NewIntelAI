import React from 'react';

/**
 * Reusable loading spinner
 */
const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-brand-accent border-brand-border ${sizes[size]}`}
      ></div>
    </div>
  );
};

export default Loader;
