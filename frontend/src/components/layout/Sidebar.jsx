import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, LogOut, Newspaper, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Responsive Sidebar Navigation for dashboard user pages
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze News', path: '/analyze', icon: PlusCircle },
    { name: 'History', path: '/history', icon: FileText }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-brand-surface border-r border-brand-border flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-brand-border">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 text-white font-bold text-lg tracking-tight font-heading focus:outline-none"
          >
            <div className="p-1.5 bg-brand-accent/15 rounded-lg border border-brand-accent/20 text-brand-accent">
              <Newspaper className="w-5 h-5 shrink-0" />
            </div>
            <span>
              NewsIntel<span className="text-brand-accent font-extrabold ml-0.5">AI</span>
            </span>
          </NavLink>
        </div>

        {/* Sidebar Links */}
        <nav className="p-4 flex flex-col gap-1.5">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                // If on mobile/tablet viewports, toggle drawer closed on selection
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20'
                    : 'text-gray-400 hover:bg-brand-surface-elevated hover:text-white border-transparent'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Account Info and Logout footer block */}
      <div className="p-4 border-t border-brand-border bg-brand-bg/40">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-brand-surface-elevated/40 border border-brand-border mb-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent text-xs font-bold shrink-0">
            {user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <User className="w-4 h-4 shrink-0" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-950/20 text-red-400 hover:bg-red-900/30 hover:text-red-300 font-semibold rounded-lg text-xs border border-red-500/20 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
