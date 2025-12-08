
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MasterAsset from './components/MasterAsset';
import ATK from './components/ATK';
import ARK from './components/ARK';
import Contract from './components/Contract';
import Timesheet from './components/Timesheet';
import Vendor from './components/Vendor';
import CreditCard from './components/CreditCard';
import LogBook from './components/LogBook';
import ProjectManagement from './components/ProjectManagement';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'atk': return <ATK />;
      case 'ark': return <ARK />;
      case 'asset-control': return <MasterAsset />;
      case 'contract': return <Contract />;
      case 'timesheet': return <Timesheet />;
      case 'vendor': return <Vendor />;
      case 'credit-card': return <CreditCard />;
      case 'log-book': return <LogBook />;
      case 'project-management': return <ProjectManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-20">
             <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Settings size={48} className="text-gray-300" />
             </div>
             <h2 className="text-xl font-bold text-gray-600">Coming Soon</h2>
             <p className="text-sm mt-2">The module <span className="font-mono text-gray-900 bg-gray-200 px-1 rounded">{activeView}</span> is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
