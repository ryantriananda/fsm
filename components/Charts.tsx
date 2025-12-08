import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartData } from '../types';

interface ChartProps {
  data: ChartData[];
  title: string;
  type: 'pie' | 'donut';
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-lg rounded text-sm">
          <p className="font-semibold">{`${payload[0].name}`}</p>
          <p className="text-gray-600">{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

const Charts: React.FC<ChartProps> = ({ data, title, type }) => {
  const innerRadius = type === 'donut' ? 60 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <div className="flex gap-2">
            <button className="text-gray-400 hover:text-gray-600"><span className="sr-only">Settings</span></button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={type === 'donut' ? undefined : renderCustomizedLabel}
              outerRadius={100}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {type === 'donut' && (
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
            )}
            
            {/* Inner Label for Donut */}
            {type === 'donut' && (
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold fill-gray-700">
                    Logs
                </text>
            )}

          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;