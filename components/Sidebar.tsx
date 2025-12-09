
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown,
  ChevronRight,
  Pencil,
  ShoppingCart,
  PieChart,
  CreditCard,
  Home,
  BookOpen,
  BarChart,
  Circle
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const [isMasterAssetOpen, setIsMasterAssetOpen] = useState(false);

  // Auto-expand Master Asset if a child is active
  useEffect(() => {
    const masterAssetKeys = [
      'asset-list', 'asset-category', 'asset-location', 'asset-status', 
      'vendor', 'contract', 'asset-value', 'maintenance-schedule', 
      'maintenance-type', 'sparepart', 'disposal', 'asset-docs', 'asset-role', 'role-permissions'
    ];
    if (masterAssetKeys.includes(activeView)) {
      setIsMasterAssetOpen(true);
    }
  }, [activeView]);

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
      <nav className="flex-1 px-2 space-y-1 pb-10">
        <NavItem 
          icon={<Pencil size={18} />} 
          label="ATK" 
          active={activeView === 'atk'} 
          onClick={() => onNavigate('atk')} 
        />
        <NavItem 
          icon={<ShoppingCart size={18} />} 
          label="ARK" 
          active={activeView === 'ark'} 
          onClick={() => onNavigate('ark')} 
        />
        <NavItem 
          icon={<PieChart size={18} />} 
          label="Timesheet" 
          active={activeView === 'timesheet'} 
          onClick={() => onNavigate('timesheet')} 
        />
        <NavItem 
          icon={<CreditCard size={18} />} 
          label="Credit Card" 
          active={activeView === 'credit-card'} 
          onClick={() => onNavigate('credit-card')} 
        />

        {/* Master Asset Accordion */}
        <div className="pt-2 pb-2">
          <div 
            onClick={() => setIsMasterAssetOpen(!isMasterAssetOpen)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 border-l-4 border-transparent text-gray-400 hover:bg-gray-800 hover:text-white group`}
          >
            <div className="flex items-center gap-3">
              <Home size={18} className="group-hover:text-white transition-colors"/>
              <span className="text-sm font-medium">Master Asset</span>
            </div>
            {isMasterAssetOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          
          {isMasterAssetOpen && (
            <div className="mt-1 space-y-0.5 bg-gray-900/50 rounded-lg py-1">
              <SubNavItem label="Daftar Asset" onClick={() => onNavigate('asset-list')} active={activeView === 'asset-list'} />
              <SubNavItem label="Kategori Asset" onClick={() => onNavigate('asset-category')} active={activeView === 'asset-category'} />
              <SubNavItem label="Lokasi Asset" onClick={() => onNavigate('asset-location')} active={activeView === 'asset-location'} />
              <SubNavItem label="Status Asset" onClick={() => onNavigate('asset-status')} active={activeView === 'asset-status'} />
              
              {/* Added Vendor sub-menu item */}
              <SubNavItem label="Vendor" onClick={() => onNavigate('vendor')} active={activeView === 'vendor'} />
              
              <SubNavItem label="Kontrak Asset" onClick={() => onNavigate('contract')} active={activeView === 'contract'} />
              <SubNavItem label="Nilai & Penyusutan" onClick={() => onNavigate('asset-value')} active={activeView === 'asset-value'} />
              <SubNavItem label="Jadwal Maintenance" onClick={() => onNavigate('maintenance-schedule')} active={activeView === 'maintenance-schedule'} />
              <SubNavItem label="Jenis Maintenance" onClick={() => onNavigate('maintenance-type')} active={activeView === 'maintenance-type'} />
              <SubNavItem label="Sparepart" onClick={() => onNavigate('sparepart')} active={activeView === 'sparepart'} />
              <SubNavItem label="Disposal & Mutasi" onClick={() => onNavigate('disposal')} active={activeView === 'disposal'} />
              <SubNavItem label="Dokumen Asset" onClick={() => onNavigate('asset-docs')} active={activeView === 'asset-docs'} />
              <SubNavItem label="Role & PIC" onClick={() => onNavigate('asset-role')} active={activeView === 'asset-role'} />
              <SubNavItem label="Role Permissions" onClick={() => onNavigate('role-permissions')} active={activeView === 'role-permissions'} />
            </div>
          )}
        </div>

        <NavItem 
          icon={<BookOpen size={18} />} 
          label="Log Book" 
          active={activeView === 'log-book'} 
          onClick={() => onNavigate('log-book')} 
        />
        <NavItem 
          icon={<BarChart size={18} />} 
          label="Project Management" 
          active={activeView === 'project-management'} 
          onClick={() => onNavigate('project-management')} 
        />
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
      flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 border-l-4 mb-1
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
}

const SubNavItem: React.FC<SubNavItemProps> = ({ label, active, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors pl-11 text-sm
        ${active ? 'text-white font-medium bg-gray-800' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}
      `}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-gray-600'}`}></div>
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
