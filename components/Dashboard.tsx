import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  Users, 
  FileText, 
  Wrench, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowRight,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { dashboardService, assetService, assetCategoryService, assetLocationService, vendorService, contractService } from '../services/supabaseService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    locations: 0,
    categories: 0,
    vendors: 0,
    contracts: 0,
    pendingMaintenance: 0,
    lowStockATK: 0,
    activeProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assets, categories, locations, vendors, contracts, dashStats] = await Promise.all([
        assetService.getAll().catch(() => []),
        assetCategoryService.getAll().catch(() => []),
        assetLocationService.getAll().catch(() => []),
        vendorService.getAll().catch(() => []),
        contractService.getAll().catch(() => []),
        dashboardService.getStats().catch(() => ({
          pendingMaintenance: 0,
          lowStockATK: 0,
          activeProjects: 0
        }))
      ]);

      setStats({
        totalAssets: assets.length || 0,
        locations: locations.length || 0,
        categories: categories.length || 0,
        vendors: vendors.length || 0,
        contracts: contracts.length || 0,
        pendingMaintenance: (dashStats as any).pendingMaintenance || 0,
        lowStockATK: (dashStats as any).lowStockATK || 0,
        activeProjects: (dashStats as any).activeProjects || 0,
      });
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load data');
    }
    setLoading(false);
  };

  const recentActivities = [
    { action: 'Asset ditambahkan', item: 'Laptop Dell XPS 15', user: 'Admin', time: '5 menit lalu', type: 'create' },
    { action: 'Maintenance selesai', item: 'AC Server Room', user: 'Teknisi', time: '2 jam lalu', type: 'complete' },
    { action: 'Kontrak diperpanjang', item: 'PT Supplier Indo', user: 'Finance', time: '4 jam lalu', type: 'update' },
    { action: 'Asset dipindahkan', item: 'Printer HP LaserJet', user: 'GA', time: '1 hari lalu', type: 'move' },
  ];

  const upcomingMaintenance = [
    { asset: 'Server Room AC', type: 'HVAC Service', date: '15 Des 2025', priority: 'high' },
    { asset: 'Toyota Avanza', type: 'Service Berkala', date: '20 Des 2025', priority: 'medium' },
    { asset: 'UPS System', type: 'Battery Check', date: '25 Des 2025', priority: 'low' },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-full">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Selamat Datang! 👋</h1>
        <p className="text-gray-500 mt-1">Berikut ringkasan asset management hari ini</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Package size={20} className="text-blue-600" />
            </div>
            <span className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp size={14} className="mr-1" />
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalAssets}</p>
          <p className="text-sm text-gray-500">Total Asset</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <MapPin size={20} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.locations}</p>
          <p className="text-sm text-gray-500">Lokasi</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-violet-50 rounded-xl">
              <Users size={20} className="text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.vendors}</p>
          <p className="text-sm text-gray-500">Vendor</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <FileText size={20} className="text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.contracts}</p>
          <p className="text-sm text-gray-500">Kontrak Aktif</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-red-50 rounded-xl">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <span className="flex items-center text-xs text-red-600 font-medium">
              <TrendingDown size={14} className="mr-1" />
              3
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-sm text-gray-500">Perlu Perhatian</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Aktivitas Terbaru</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </button>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'create' ? 'bg-green-50 text-green-600' :
                    activity.type === 'complete' ? 'bg-blue-50 text-blue-600' :
                    activity.type === 'update' ? 'bg-amber-50 text-amber-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    <Package size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span>
                      <span className="text-gray-500"> - {activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Maintenance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Jadwal Maintenance</h2>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal size={18} className="text-gray-400" />
            </button>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {upcomingMaintenance.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{item.asset}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' :
                      item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {item.priority === 'high' ? 'Urgent' : item.priority === 'medium' ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{item.type}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 bg-gray-900 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Wrench size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-medium">3 Maintenance Pending</p>
            <p className="text-gray-400 text-sm">Segera jadwalkan untuk menghindari kerusakan</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
