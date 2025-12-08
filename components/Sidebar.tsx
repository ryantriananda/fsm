
import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown,
  ChevronRight,
  Pencil,
  ShoppingCart,
  FileText,
  PieChart,
  User,
  CreditCard,
  Home,
  BookOpen,
  BarChart,
  Box,
  Calendar,
  MapPin,
  Clipboard,
  Wrench
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const [isMasterAssetOpen, setIsMasterAssetOpen] = useState(false);

  // Check if any sub-item of Master Asset is active
  const isMasterAssetActive = [
    'asset-control', 
    'asset-calendar', 
    'asset-tracking', 
    'maintenance-request', 
    'work-order'
  ].includes(activeView);

  return (
    <aside className="w-64 bg-black h-screen fixed left-0 top-0 border-r border-gray-800 flex flex-col z-20 overflow-y-auto font-sans text-gray-300">
      {/* Logo Area */}
      <div className="p-4 flex items-center gap-2 mb-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
        <div className="text-white font-bold text-2xl">M</div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">MODENA</h1>
          <p className="text-xs text-gray-500 font-medium tracking-wider">SMART LIVING</p>
        </div>
      </div>

      {/* User Dropdown */}
      <div className="px-4 mb-4">
        <button className="flex items-center justify-between w-full text-sm font-medium text-gray-400 hover:text-white transition-colors">
          Modena Admin <ChevronDown size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-gray-900 text-gray-300 text-sm rounded-full py-2 pl-9 pr-4 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 placeholder-gray-500 transition-all hover:bg-gray-800"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-6 pb-10">
        
        {/* HR Core */}
        <div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 px-3">HR Core</div>
            <div className="space-y-1">
                <NavItem icon={<FileText size={18} />} label="Contract" active={activeView === 'contract'} onClick={() => onNavigate('contract')} />
                <NavItem icon={<PieChart size={18} />} label="Timesheet" active={activeView === 'timesheet'} onClick={() => onNavigate('timesheet')} />
            </div>
        </div>

        {/* HR - GA */}
        <div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 px-3">HR — GA</div>
             <div className="space-y-1">
                <NavItem icon={<Pencil size={18} />} label="ATK" active={activeView === 'atk'} onClick={() => onNavigate('atk')}/>
                <NavItem icon={<User size={18} />} label="Vendor" active={activeView === 'vendor'} onClick={() => onNavigate('vendor')} />
            </div>
        </div>

        {/* Finance Support */}
        <div>
             <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 px-3">Finance Support</div>
             <div className="space-y-1">
                <NavItem icon={<CreditCard size={18} />} label="Credit Card" active={activeView === 'credit-card'} onClick={() => onNavigate('credit-card')} />
             </div>
        </div>

        {/* Facility / Asset */}
        <div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 px-3">Facility / Asset</div>
            <div className="space-y-1">
                 {/* Master Asset Accordion */}
                <div>
                    <button 
                        onClick={() => setIsMasterAssetOpen(!isMasterAssetOpen)}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md cursor-pointer transition-colors border-l-4 ${
                        isMasterAssetActive 
                            ? 'bg-gray-800 text-white font-medium border-white' 
                            : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Home size={18} />
                            <span className="text-sm">Master Asset</span>
                        </div>
                        {isMasterAssetOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {isMasterAssetOpen && (
                        <div className="pl-4 space-y-1 mt-1 mb-2 bg-gray-900/50 py-2 rounded-lg">
                            <SubNavItem 
                                icon={<Box size={16} />}
                                label="Asset Control" 
                                active={activeView === 'asset-control'} 
                                onClick={() => onNavigate('asset-control')} 
                            />
                            <SubNavItem 
                                icon={<Calendar size={16} />}
                                label="Asset Calendar" 
                                active={activeView === 'asset-calendar'} 
                                onClick={() => onNavigate('asset-calendar')} 
                            />
                            <SubNavItem 
                                icon={<MapPin size={16} />}
                                label="Asset Tracking" 
                                active={activeView === 'asset-tracking'} 
                                onClick={() => onNavigate('asset-tracking')} 
                            />
                            <SubNavItem 
                                icon={<Clipboard size={16} />}
                                label="Maintenance Request" 
                                active={activeView === 'maintenance-request'} 
                                onClick={() => onNavigate('maintenance-request')} 
                            />
                            <SubNavItem 
                                icon={<Wrench size={16} />}
                                label="Work Order" 
                                active={activeView === 'work-order'} 
                                onClick={() => onNavigate('work-order')} 
                            />
                        </div>
                    )}
                </div>

                <NavItem icon={<BookOpen size={18} />} label="Log Book" active={activeView === 'log-book'} onClick={() => onNavigate('log-book')} />
                <NavItem icon={<ShoppingCart size={18} />} label="ARK" active={activeView === 'ark'} onClick={() => onNavigate('ark')} />
            </div>
        </div>

        {/* Operation */}
        <div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 px-3">Operation</div>
            <div className="space-y-1">
                <NavItem icon={<BarChart size={18} />} label="Project Management" active={activeView === 'project-management'} onClick={() => onNavigate('project-management')} />
            </div>
        </div>

      </nav>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className={`
      flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 border-l-4
      ${active 
        ? 'bg-gray-800 text-white font-medium border-white shadow-md' 
        : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white hover:pl-4'}
    `}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
};

interface SubNavItemProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
    icon?: React.ReactNode;
}

const SubNavItem: React.FC<SubNavItemProps> = ({ label, active, onClick, icon }) => {
    return (
        <div 
            onClick={onClick}
            className={`
            flex items-center gap-2 px-3 py-2 mx-2 rounded-md cursor-pointer transition-colors text-sm
            ${active ? 'text-white font-medium bg-gray-800' : 'text-gray-500 hover:text-white hover:bg-gray-800'}
            `}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}

export default Sidebar;
