import React from 'react';

/**
 * Clean Badge pill component for labels and statuses
 */
const Badge = ({ children, variant = 'primary', className = '' }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide';
  
  const variants = {
    primary: 'bg-indigo-950/30 text-indigo-300 border-indigo-500/20',
    secondary: 'bg-slate-800 text-gray-400 border-slate-700',
    success: 'bg-green-950/30 text-green-300 border-green-500/20',
    warning: 'bg-amber-950/30 text-amber-300 border-amber-500/20',
    danger: 'bg-red-950/30 text-red-300 border-red-500/20'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
