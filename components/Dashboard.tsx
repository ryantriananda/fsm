
import React, { useState } from 'react';
import { Calendar, Play, Printer, Plus, Edit, Sparkles, Loader2, Clock, AlertCircle, ArrowRight, ArrowUpRight } from 'lucide-react';
import KpiCard from './KpiCard';
import Charts from './Charts';
import { DashboardMetrics } from '../types';
import { generateDashboardInsights } from '../services/geminiService';

const mockData: DashboardMetrics = {
  kpis: [
    { id: '1', title: 'Total Assets', value: 1245, iconName: 'box', color: 'blue', trend: '+12 New this month' },
    { id: '2', title: 'Total Asset Value', value: '$1.42M', iconName: 'dollar', color: 'emerald', trend: '+2.4% Appreciation' },
    { id: '3', title: 'Maintenance Pending', value: 8, iconName: 'wrench', color: 'amber', trend: '3 High Priority' },
    { id: '4', title: 'Low Stock Alerts', value: 5, iconName: 'alert', color: 'rose', trend: 'Restock needed' },
  ],
  assetCategories: [
    { name: 'Electronics', value: 450, fill: '#1e293b' }, // Slate 800
    { name: 'Furniture', value: 300, fill: '#3b82f6' }, // Blue 500
    { name: 'Vehicles', value: 50, fill: '#059669' }, // Emerald 600
    { name: 'Machinery', value: 120, fill: '#d97706' }, // Amber 600
    { name: 'Stationery', value: 325, fill: '#6366f1' }, // Indigo 500
  ],
  assetStatus: [
    { name: 'Active', value: 85, fill: '#10b981' }, // Emerald
    { name: 'In Maintenance', value: 10, fill: '#f59e0b' }, // Amber
    { name: 'Disposed', value: 5, fill: '#ef4444' }, // Red
  ],
  upcomingMaintenance: [
    { id: 'M1', asset_name: 'Server Room A - HVAC', task_name: 'Filter Replacement', due_date: 'Tomorrow', priority: 'High', assignee: 'CoolAir Inc' },
    { id: 'M2', asset_name: 'Toyota Avanza (B 1234 XX)', task_name: 'Regular Service', due_date: 'Oct 30, 2023', priority: 'Medium', assignee: 'Auto2000' },
    { id: 'M3', asset_name: 'Elevator Passenger 1', task_name: 'Safety Inspection', due_date: 'Nov 02, 2023', priority: 'High', assignee: 'Otis' },
    { id: 'M4', asset_name: 'Meeting Room Projector', task_name: 'Lamp Check', due_date: 'Nov 05, 2023', priority: 'Low', assignee: 'Internal IT' },
  ],
  recentActivity: [
    { id: 'A1', action: 'New Asset Registered', details: 'MacBook Pro M3 Pro - Assigned to Design', time: '2 hours ago', user: 'Admin', type: 'System' },
    { id: 'A2', action: 'Maintenance Completed', details: 'Generator Backup Test passed', time: '4 hours ago', user: 'Technician', type: 'Maintenance' },
    { id: 'A3', action: 'Asset Mutation', details: 'Ergo Chair moved from Room 101 to 102', time: 'Yesterday', user: 'GA Staff', type: 'Mutation' },
    { id: 'A4', action: 'Stock Alert', details: 'A4 Paper stock below minimum (10)', time: 'Yesterday', user: 'System', type: 'System' },
  ]
};

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const handleGenerateInsights = async () => {
    setLoadingInsights(true);
    setInsights(null);
    const result = await generateDashboardInsights(mockData);
    setInsights(result);
    setLoadingInsights(false);
  };

  return (
    <div className="p-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Facility Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Overview of assets, maintenance, and operations.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            {/* AI Insight Button */}
            <button 
                onClick={handleGenerateInsights}
                disabled={loadingInsights}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium border border-gray-900"
            >
                {loadingInsights ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} className="text-amber-300" />}
                {loadingInsights ? 'Analyzing...' : 'AI Insights'}
            </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all text-sm font-medium">
            <Printer size={16} className="text-gray-500" />
            Print
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all text-sm font-medium">
            <Plus size={16} />
            Quick Action
          </button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {insights && (
        <div className="mb-8 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-xl relative animate-fade-in shadow-sm">
          <button 
            onClick={() => setInsights(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
          >
            ×
          </button>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-full text-indigo-600 shadow-sm border border-indigo-50 mt-1">
                <Sparkles size={24} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Analysis</h3>
                <div className="prose prose-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {insights}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mockData.kpis.map((kpi) => (
          <KpiCard key={kpi.id} data={kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Charts 
          title="Assets by Category" 
          data={mockData.assetCategories} 
          type="donut" 
        />
        <Charts 
          title="Asset Status Distribution" 
          data={mockData.assetStatus} 
          type="pie" 
        />
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Maintenance Due Soon */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock size={20} className="text-amber-500" />
                    Maintenance Due Soon
                </h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    View Schedule <ArrowRight size={14} />
                </button>
            </div>
            <div className="space-y-4">
                {mockData.upcomingMaintenance.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors group">
                        <div className="flex gap-4 items-center">
                            <div className={`w-1.5 h-12 rounded-full ${
                                task.priority === 'High' ? 'bg-rose-500' : 
                                task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}></div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{task.asset_name}</h4>
                                <p className="text-sm text-gray-500">{task.task_name} • <span className="text-gray-700 font-medium">{task.assignee}</span></p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                task.due_date === 'Tomorrow' ? 'bg-rose-100 text-rose-700' : 'bg-gray-200 text-gray-700'
                            }`}>
                                {task.due_date}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Recent Activity / Mutations */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ArrowUpRight size={20} className="text-blue-500" />
                    Recent Activity
                </h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    View Log Book <ArrowRight size={14} />
                </button>
            </div>
            <div className="relative pl-4 space-y-6">
                 {/* Vertical Line */}
                 <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                 {mockData.recentActivity.map((log) => (
                     <div key={log.id} className="relative pl-6">
                         {/* Dot */}
                         <div className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                             log.type === 'Mutation' ? 'bg-blue-500' :
                             log.type === 'Maintenance' ? 'bg-amber-500' :
                             log.type === 'System' ? 'bg-gray-400' : 'bg-emerald-500'
                         }`}></div>
                         
                         <div className="flex justify-between items-start">
                             <div>
                                 <p className="text-sm font-bold text-gray-900">{log.action}</p>
                                 <p className="text-sm text-gray-600 mt-0.5">{log.details}</p>
                                 <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                     <span>{log.user}</span> • <span>{log.time}</span>
                                 </p>
                             </div>
                         </div>
                     </div>
                 ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
