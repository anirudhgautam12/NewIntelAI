import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable premium overlay dialog container (Modal)
 */
const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  // Listen for Escape key binds and manage page scrolls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay blur effect */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card body */}
      <div
        className={`relative w-full max-w-md bg-brand-surface-elevated border border-brand-border rounded-xl shadow-2xl p-6 overflow-hidden transition-all duration-300 z-10 ${className}`}
      >
        <div className="flex items-center justify-between mb-4 border-b border-brand-border/40 pb-3">
          <h3 className="text-base font-bold text-gray-100 font-heading">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors duration-200 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-gray-300 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
