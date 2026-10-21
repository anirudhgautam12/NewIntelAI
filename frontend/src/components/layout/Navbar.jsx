import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Newspaper, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';

/**
 * Global responsive Header Navigation bar for public pages
 */
const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-brand-border bg-brand-bg/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo Link */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-bold text-lg tracking-tight font-heading focus:outline-none"
            >
              <div className="p-1.5 bg-brand-accent/15 rounded-lg border border-brand-accent/20 text-brand-accent">
                <Newspaper className="w-5 h-5 shrink-0" />
              </div>
              <span className="flex items-center">
                NewsIntel<span className="text-brand-accent ml-1 font-extrabold">AI</span>
              </span>
            </Link>
          </div>
          
          {/* Public Sections */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors duration-200">
              How It Works
            </a>
          </div>

          {/* User auth states */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                  icon={Sparkles}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
