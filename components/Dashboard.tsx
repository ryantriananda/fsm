import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  FileText, 
  Users, 
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor, iconBg, trend }) => (
  <div className={`${bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <TrendingUp size={12} className="text-gray-400" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${iconBg}`}>
        {icon}
      </div>
    </div>
  </div>
);

interface RecentActivityProps {
  type: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

const RecentActivity: React.FC<RecentActivityProps> = ({ type, description, time, status }) => {
  const statusColors = {
    success: 'bg-gray-100 text-gray-600',
    warning: 'bg-gray-100 text-gray-600',
    info: 'bg-gray-100 text-gray-600'
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${statusColors[status]}`}>
        <Activity size={16} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{type}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeAssets: 0,
    locations: 0,
    categories: 0,
    vendors: 0,
    contracts: 0,
    maintenanceSchedules: 0,
    pendingMaintenance: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [assets, categories, locations, statuses, vendors, contracts] = await Promise.all([
        fetch('http://localhost:8080/api/assets').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('http://localhost:8080/api/asset-categories').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('http://localhost:8080/api/asset-locations').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('http://localhost:8080/api/asset-statuses').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('http://localhost:8080/api/vendors').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('http://localhost:8080/api/contracts').then(r => r.json()).catch(() => ({ data: [] }))
      ]);

      setStats({
        totalAssets: assets.data?.length || 0,
        activeAssets: assets.data?.filter((a: any) => a.status_id === 1)?.length || 0,
        locations: locations.data?.length || 0,
        categories: categories.data?.length || 0,
        vendors: vendors.data?.length || 0,
        contracts: contracts.data?.length || 0,
        maintenanceSchedules: 0,
        pendingMaintenance: 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setLoading(false);
  };

  const recentActivities: RecentActivityProps[] = [
    { type: 'Asset Created', description: 'New laptop added to inventory', time: '2 min ago', status: 'success' },
    { type: 'Maintenance Due', description: 'Server Room AC needs service', time: '1 hour ago', status: 'warning' },
    { type: 'Contract Expiring', description: 'Vendor contract expires in 30 days', time: '3 hours ago', status: 'warning' },
    { type: 'Asset Transferred', description: 'Printer moved to Floor 2', time: '5 hours ago', status: 'info' },
    { type: 'Document Added', description: 'Warranty uploaded for MacBook', time: '1 day ago', status: 'success' },
  ];

  const upcomingMaintenance = [
    { asset: 'Server Room AC', type: 'HVAC Service', date: '2025-12-15', vendor: 'CoolAir Inc' },
    { asset: 'Toyota Avanza', type: 'Car Service', date: '2025-12-20', vendor: 'Auto2000' },
    { asset: 'UPS System', type: 'Battery Check', date: '2025-12-25', vendor: 'PowerTech' },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f3f4f6] min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Facility & Asset Management Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Assets"
          value={stats.totalAssets}
          icon={<Package size={24} className="text-gray-600" />}
          bgColor="bg-white"
          iconBg="bg-gray-100"
          trend="+12% from last month"
        />
        <StatCard
          title="Locations"
          value={stats.locations}
          icon={<MapPin size={24} className="text-gray-600" />}
          bgColor="bg-white"
          iconBg="bg-gray-100"
        />
        <StatCard
          title="Categories"
          value={stats.categories}
          icon={<CheckCircle size={24} className="text-gray-600" />}
          bgColor="bg-white"
          iconBg="bg-gray-100"
        />
        <StatCard
          title="Vendors"
          value={stats.vendors}
          icon={<Users size={24} className="text-gray-600" />}
          bgColor="bg-white"
          iconBg="bg-gray-100"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Contracts"
          value={stats.contracts}
          icon={<FileText size={24} className="text-gray-600" />}
          bgColor="bg-white"
          iconBg="bg-gray-100"
        />
        <StatCard
          title="Pending Maintenance"
          value={3}
          icon={<Wrench size={24} className="text-gray-600" />}
          bgColor="bg-white"
          iconBg="bg-gray-100"
        />
        <StatCard
          title="Expiring Soon"
          value={2}
          icon={<AlertTriangle size={24} className="text-gray-600" />}
          bgColor="bg-white"
          iconBg="bg-gray-100"
        />
        <StatCard
          title="Total Value"
          value="Rp 1.2B"
          icon={<DollarSign size={24} className="text-gray-600" />}
          bgColor="bg-white"
          iconBg="bg-gray-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-gray-500 hover:text-gray-900">View All</button>
          </div>
          <div className="space-y-2">
            {recentActivities.map((activity, index) => (
              <RecentActivity key={index} {...activity} />
            ))}
          </div>
        </div>

        {/* Upcoming Maintenance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Maintenance</h2>
            <Calendar size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingMaintenance.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">{item.asset}</p>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.vendor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            <Package size={24} className="text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Add Asset</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            <Wrench size={24} className="text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Schedule Maintenance</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            <Users size={24} className="text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Add Vendor</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            <FileText size={24} className="text-gray-700" />
            <span className="text-sm font-medium text-gray-700">New Contract</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            <AlertTriangle size={24} className="text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Report Issue</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            <TrendingUp size={24} className="text-gray-700" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
