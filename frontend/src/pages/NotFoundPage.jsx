import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';
import Button from '../components/common/Button.jsx';

/**
 * 404 Not Found Page
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
      
      {/* Decorative pulse glows */}
      <div className="absolute w-[300px] h-[300px] bg-glow-indigo rounded-full top-1/3 left-1/3 pointer-events-none select-none z-0 opacity-40 animate-pulse" />
      
      <div className="relative z-10 max-w-md flex flex-col items-center gap-6">
        
        {/* Glow boundary icon */}
        <div className="p-4 bg-brand-surface border border-brand-border rounded-full text-brand-accent animate-bounce">
          <HelpCircle className="w-12 h-12 shrink-0" />
        </div>
        
        {/* Text descriptions */}
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-extrabold text-white font-heading">404</h1>
          <h2 className="text-lg font-bold text-gray-200 font-heading">Page Not Found</h2>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed mt-1 tracking-wide">
            The page you are looking for does not exist or has been moved to a different path.
          </p>
        </div>

        <Button variant="primary" onClick={() => navigate('/')} icon={Home}>
          Return Home
        </Button>
        
      </div>
    </div>
  );
};

export default NotFoundPage;
