import React from 'react';
import { Newspaper } from 'lucide-react';

/**
 * Reusable project footer with copyright and link maps
 */
const Footer = () => {
  return (
    <footer className="border-t border-brand-border bg-[#030712] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo brand footer info */}
          <div className="flex items-center gap-2">
            <div className="p-1 bg-brand-accent/15 rounded-md border border-brand-accent/25 text-brand-accent">
              <Newspaper className="w-4 h-4 shrink-0" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight font-heading">
              NewsIntel<span className="text-brand-accent ml-0.5">AI</span>
            </span>
          </div>
          
          {/* Copyright notice */}
          <p className="text-xs text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} NewsIntel AI. All rights reserved. B.Tech Major Project.
          </p>
          
          {/* Static link placeholders */}
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
