
import React from 'react';
import { Puzzle, Car, Users, Home, Gauge, Activity, Box, DollarSign, Wrench, AlertTriangle } from 'lucide-react';
import { KpiData } from '../types';

interface KpiCardProps {
  data: KpiData;
}

const iconMap = {
  puzzle: Puzzle,
  car: Car,
  users: Users,
  home: Home,
  gauge: Gauge,
  chart: Activity,
  box: Box,
  dollar: DollarSign,
  wrench: Wrench,
  alert: AlertTriangle
};

// Elegant color palette mapping
// Using soft backgrounds (50) and deep text colors (700) for a premium look
const colorVariants: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-800' }, // Default fallback
};

const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
  const IconComponent = iconMap[data.iconName] || Puzzle;
  // specific color or fallback to slate
  const theme = colorVariants[data.color] || colorVariants.slate;

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all duration-300 group">
      <div>
        <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform origin-left">{data.value}</div>
        <div className="text-sm font-medium text-gray-500">{data.title}</div>
        {data.trend && (
            <div className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                {data.trend}
            </div>
        )}
      </div>
      <div className={`p-4 rounded-2xl ${theme.bg} transition-colors`}>
        <IconComponent size={28} className={theme.text} />
      </div>
    </div>
  );
};

export default KpiCard;
