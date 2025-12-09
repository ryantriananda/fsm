
import React, { useState } from 'react';
import { FileText, AlertCircle, CheckCircle, Search, Filter, Download, Plus } from 'lucide-react';
import { Contract } from '../types';

const initialContracts: Contract[] = [
  { id: 'C001', title: 'Software Engineer Agreement', party_name: 'John Doe', type: 'PKWT', start_date: '2023-01-01', end_date: '2024-01-01', status: 'Expiring Soon', contract_value: 12000 },
  { id: 'C002', title: 'Security Services', party_name: 'SecureCorp Ltd', type: 'Vendor', start_date: '2022-06-01', end_date: '2025-06-01', status: 'Active', contract_value: 50000 },
  { id: 'C003', title: 'Marketing Consultant', party_name: 'Jane Smith', type: 'PKWT', start_date: '2023-03-15', end_date: '2023-09-15', status: 'Expired', contract_value: 8000 },
  { id: 'C004', title: 'Senior Manager', party_name: 'Robert Stark', type: 'PKWTT', start_date: '2020-01-01', end_date: '-', status: 'Active', contract_value: 0 },
];

const Contract: React.FC = () => {
  const [contracts] = useState<Contract[]>(initialContracts);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Expiring Soon': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Expired': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContracts = contracts.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.party_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Contract Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage employee and vendor contracts, track expirations.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md text-sm font-medium">
            <Plus size={16} /> New Contract
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search contracts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title / Party</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredContracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                      <div className="text-xs text-gray-500">{contract.party_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{contract.type}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {contract.start_date} <span className="mx-1">→</span> {contract.end_date}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {contract.contract_value ? `$${contract.contract_value.toLocaleString()}` : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                    {contract.status === 'Expiring Soon' && <AlertCircle size={12} className="mr-1" />}
                    {contract.status === 'Active' && <CheckCircle size={12} className="mr-1" />}
                    {contract.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-indigo-600 hover:text-indigo-900 cursor-pointer">
                  View
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contract;
