import React from 'react';

/**
 * Reusable and premium UI Button component
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-accent hover:bg-brand-accent-hover text-white shadow-md shadow-brand-accent/15',
    secondary: 'bg-brand-surface-elevated hover:bg-slate-800 text-gray-200 border border-brand-border',
    danger: 'bg-red-650 hover:bg-red-500 text-white shadow-md shadow-red-650/15',
    outline: 'bg-transparent border border-brand-border text-gray-300 hover:bg-brand-surface/40',
    ghost: 'bg-transparent hover:bg-brand-surface-elevated text-gray-400 hover:text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2 shrink-0" />}
      {children}
    </button>
  );
};

export default Button;
