import React from 'react';
import Button from './Button.jsx';

/**
 * Clean layout for displaying empty results or tables
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-brand-border rounded-xl bg-brand-surface/20 ${className}`}
    >
      {Icon && <Icon className="w-12 h-12 text-gray-650 mb-4 shrink-0" />}
      <h3 className="text-base font-semibold text-gray-200 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="secondary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
