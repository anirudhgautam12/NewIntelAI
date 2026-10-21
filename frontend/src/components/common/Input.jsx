import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Reusable and validated input element with support for password toggles
 */
const Input = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-400 tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-2.5 bg-brand-surface border rounded-lg text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-200 ${
            error
              ? 'border-red-500/80 focus:ring-red-500/20'
              : 'border-brand-border focus:ring-brand-accent/30'
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-500 hover:text-gray-300 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-400 font-medium tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
