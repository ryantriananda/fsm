import React from 'react';
import { Search, Bell, Settings, User, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left - Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Home</span>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-900">Dashboard</span>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-64 bg-gray-50 text-gray-700 text-sm rounded-lg py-2 pl-9 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 placeholder-gray-400"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={20} />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* User Profile */}
        <button className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <ChevronDown size={16} className="text-gray-400 hidden md:block" />
        </button>
      </div>
    </header>
  );
};

export default Header;
