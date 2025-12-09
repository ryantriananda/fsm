
import React, { useState } from 'react';
import { Search, Plus, Filter, Download, Edit2, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface MasterDataGridProps {
  title: string;
  description?: string;
  columns: Column[];
  data: any[];
}

const MasterDataGrid: React.FC<MasterDataGridProps> = ({ title, description, columns, data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md transition-all text-sm font-medium">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                      No data found.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MasterDataGrid;
