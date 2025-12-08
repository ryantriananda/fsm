import React, { useState } from 'react';
import { Calendar, Play, Printer, Plus, Edit, Sparkles, Loader2 } from 'lucide-react';
import KpiCard from './KpiCard';
import Charts from './Charts';
import { DashboardMetrics } from '../types';
import { generateDashboardInsights } from '../services/geminiService';

const mockData: DashboardMetrics = {
  kpis: [
    { id: '1', title: 'Assets', value: 40, iconName: 'puzzle', color: 'blue' },
    { id: '2', title: 'Fuel Logs', value: 6, iconName: 'car', color: 'rose' },
    { id: '3', title: 'Teams', value: 1, iconName: 'users', color: 'amber' },
    { id: '4', title: 'Facilities Area', value: 12, iconName: 'home', color: 'emerald' },
    { id: '5', title: 'Odometer Work Order', value: 3, iconName: 'gauge', color: 'indigo' },
    { id: '6', title: 'Maintenance Request', value: 26, iconName: 'chart', color: 'violet' },
  ],
  assetCategories: [
    { name: 'Electronics', value: 200, fill: '#1e293b' }, // Slate 800 (Dark)
    { name: 'Furniture', value: 200, fill: '#3b82f6' }, // Blue 500 (Vibrant)
    { name: 'Vehicles', value: 200, fill: '#059669' }, // Emerald 600 (Natural)
    { name: 'Machinery', value: 200, fill: '#d97706' }, // Amber 600 (Warm)
    { name: 'Tools', value: 200, fill: '#6366f1' }, // Indigo 500 (Deep)
  ],
  maintenanceLogs: [
    { name: 'Completed', value: 33.33, fill: '#10b981' }, // Emerald
    { name: 'Pending', value: 16.67, fill: '#f59e0b' }, // Amber
    { name: 'In Progress', value: 16.67, fill: '#3b82f6' }, // Blue
    { name: 'Overdue', value: 33.33, fill: '#ef4444' }, // Red
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
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Asset Dashboard</h2>
        
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

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-sm font-medium transition-colors shadow-sm">
            <Calendar size={16} className="text-gray-500" />
            Date Filter
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md hover:shadow-lg transition-all text-sm font-medium">
            <Play size={16} fill="currentColor" />
            Play
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all text-sm font-medium">
            <Printer size={16} className="text-gray-500" />
            Print Dashboard
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all text-sm font-medium">
            <Plus size={16} />
            Add
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all text-sm font-medium">
            <Edit size={16} className="text-gray-500" />
            Edit Layout
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockData.kpis.map((kpi) => (
          <KpiCard key={kpi.id} data={kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Charts 
          title="Asset Categories" 
          data={mockData.assetCategories} 
          type="pie" 
        />
        <Charts 
          title="Maintenance Logs" 
          data={mockData.maintenanceLogs} 
          type="donut" 
        />
      </div>
    </div>
  );
};

export default Dashboard;