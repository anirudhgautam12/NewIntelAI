import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar.jsx';

/**
 * Dashboard Shell Layout implementing responsive Sidebars and header bars
 */
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col md:flex-row">
      
      {/* Sidebar Panel Drawer */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Sidebar Mobile Backdrop Drawer close area */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/75 z-20 md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Workspace Container */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Mobile Header Bar - Sticky */}
        <header className="h-16 border-b border-brand-border flex items-center justify-between px-6 bg-brand-surface md:hidden sticky top-0 z-20">
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-400 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 shrink-0" />
            ) : (
              <Menu className="w-6 h-6 shrink-0" />
            )}
          </button>
          
          <span className="text-white font-bold text-base tracking-tight font-heading">
            NewsIntel<span className="text-brand-accent ml-0.5">AI</span>
          </span>
          <div className="w-6" /> {/* Horizontal spacing alignment */}
        </header>

        {/* Core view content slots */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto box-border">
          {children}
        </main>
        
      </div>
    </div>
  );
};

export default DashboardLayout;
