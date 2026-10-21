import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';

/**
 * Premium layout for displaying error logs and retry actions
 */
const ErrorState = ({
  title = 'An error occurred',
  message,
  onRetry,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border border-red-500/20 rounded-xl bg-red-950/5 max-w-md mx-auto ${className}`}
    >
      <AlertTriangle className="w-12 h-12 text-red-500/80 mb-4 shrink-0" />
      <h3 className="text-base font-semibold text-red-400 mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
