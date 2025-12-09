
import React, { useState } from 'react';
import { Package, FileText, Plus, Check, X, Search, AlertCircle, Filter, Download } from 'lucide-react';
import { ATKItem, ATKRequest } from '../types';

// Mock Data for Inventory
const initialInventory: ATKItem[] = [
  { id: '1', name: 'A4 Paper (80gsm)', stock_qty: 45, unit: 'Rim', category: 'Paper', min_stock: 10 },
  { id: '2', name: 'Ballpoint Pen (Black)', stock_qty: 120, unit: 'Pcs', category: 'Writing', min_stock: 50 },
  { id: '3', name: 'Ballpoint Pen (Blue)', stock_qty: 85, unit: 'Pcs', category: 'Writing', min_stock: 50 },
  { id: '4', name: 'Stapler No. 10', stock_qty: 15, unit: 'Pcs', category: 'Desk Accessories', min_stock: 5 },
  { id: '5', name: 'Staples Refill No. 10', stock_qty: 50, unit: 'Box', category: 'Desk Accessories', min_stock: 20 },
  { id: '6', name: 'Post-it Notes (Yellow)', stock_qty: 30, unit: 'Pad', category: 'Paper', min_stock: 10 },
  { id: '7', name: 'Bantex Folder (Blue)', stock_qty: 8, unit: 'Pcs', category: 'Filing', min_stock: 15 }, // Low stock example
];

// Mock Data for Requests
const initialRequests: ATKRequest[] = [
  { 
    id: 'REQ-001', 
    employee_name: 'Sarah Jenkins', 
    division: 'Marketing', 
    request_date: '2023-10-25', 
    status: 'Pending',
    items: [{ itemId: '1', itemName: 'A4 Paper (80gsm)', quantity: 2 }] 
  },
  { 
    id: 'REQ-002', 
    employee_name: 'Mike Ross', 
    division: 'Legal', 
    request_date: '2023-10-24', 
    status: 'Approved',
    items: [{ itemId: '2', itemName: 'Ballpoint Pen (Black)', quantity: 5 }, { itemId: '6', itemName: 'Post-it Notes', quantity: 2 }] 
  },
  { 
    id: 'REQ-003', 
    employee_name: 'Jessica Pearson', 
    division: 'Management', 
    request_date: '2023-10-23', 
    status: 'Rejected',
    items: [{ itemId: '2', itemName: 'Ballpoint Pen (Black)', quantity: 50 }] 
  },
];

const ATK: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');
  const [inventory, setInventory] = useState<ATKItem[]>(initialInventory);
  const [requests, setRequests] = useState<ATKRequest[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Request Approval
  const handleApprove = (reqId: string) => {
    const request = requests.find(r => r.id === reqId);
    if (!request) return;

    // Check stock availability
    let canApprove = true;
    const newInventory = [...inventory];

    for (const item of request.items) {
      const stockItemIndex = newInventory.findIndex(i => i.id === item.itemId);
      if (stockItemIndex === -1 || newInventory[stockItemIndex].stock_qty < item.quantity) {
        canApprove = false;
        break;
      }
      newInventory[stockItemIndex].stock_qty -= item.quantity;
    }

    if (canApprove) {
      setInventory(newInventory);
      setRequests(requests.map(r => r.id === reqId ? { ...r, status: 'Approved' } : r));
      alert(`Request ${reqId} approved. Stock updated.`);
    } else {
      alert('Insufficient stock to approve this request.');
    }
  };

  const handleReject = (reqId: string) => {
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: 'Rejected' } : r));
  };

  // Filtering
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter(req => 
    req.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">ATK Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage office stationery inventory and employee requests.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
            <Download size={16} />
            Export Report
          </button>
          {activeTab === 'inventory' ? (
             <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md transition-all text-sm font-medium">
                <Plus size={16} />
                Add Stock
             </button>
          ) : (
             <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md transition-all text-sm font-medium">
                <Plus size={16} />
                New Request
             </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'inventory' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Inventory Stock
          {activeTab === 'inventory' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'requests' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Requests
          <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {requests.filter(r => r.status === 'Pending').length}
          </span>
          {activeTab === 'requests' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full"></span>}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={activeTab === 'inventory' ? "Search item name or category..." : "Search employee or division..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium bg-white border border-gray-200 rounded-lg shadow-sm">
            <Filter size={16} />
            Filter
          </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === 'inventory' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-3">
                       <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                          <Package size={18} />
                       </div>
                       {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{item.stock_qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.stock_qty <= item.min_stock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle size={12} />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{req.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{req.employee_name}</div>
                      <div className="text-xs text-gray-500">{req.division}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                       <ul className="list-disc list-inside">
                          {req.items.map((i, idx) => (
                            <li key={idx}>{i.quantity}x {i.itemName}</li>
                          ))}
                       </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.request_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 
                          req.status === 'Rejected' ? 'bg-gray-100 text-gray-600' : 
                          'bg-amber-100 text-amber-800'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {req.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleApprove(req.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-xs"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button 
                             onClick={() => handleReject(req.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-xs"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATK;
