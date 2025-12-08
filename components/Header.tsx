import React from 'react';
import { Search, Bell, Cloud, Wifi, MessageSquare, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 ml-64 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-gray-900 rounded-md text-white shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        </div>
        <span className="font-semibold text-gray-900 tracking-tight">Asset Control</span>
        <ChevronDown size={16} className="text-gray-400" />
      </div>

      <div className="flex items-center gap-5">
        <button className="text-gray-400 hover:text-gray-900 transition-colors"><Search size={20} /></button>
        <button className="text-gray-400 hover:text-gray-900 transition-colors"><Wifi size={20} /></button>
        <button className="text-gray-400 hover:text-gray-900 transition-colors"><Cloud size={20} /></button>
        <div className="relative">
          <button className="text-gray-400 hover:text-gray-900 transition-colors"><Bell size={20} /></button>
          <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        </div>
        <div className="border-l border-gray-200 h-6 mx-1"></div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-full pr-3 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
            MO
          </div>
          <div className="relative">
            <MessageSquare size={20} className="text-gray-500" />
             <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white ring-2 ring-white">
              85
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;