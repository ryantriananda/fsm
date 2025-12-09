import React, { useState, useEffect } from 'react';
import { 
  Package, FileText, Plus, Check, X, Search, AlertCircle, Filter, Download, 
  Edit2, Trash2, Eye, ShoppingCart, ClipboardList, BarChart3, RefreshCw,
  ChevronDown, ArrowUpDown, TrendingUp, TrendingDown, Box, Truck, Loader2
} from 'lucide-react';
import { 
  ATKItem, ATKCategory, ATKRequest, ATKRequestItem, ATKStockTransaction,
  ATKPurchaseOrder, ATKStockOpname 
} from '../types';
import { 
  atkCategoryService, atkItemService, atkRequestService, atkTransactionService 
} from '../services/atkSupabaseService';

// Tab types
type TabType = 'inventory' | 'requests' | 'purchase' | 'opname' | 'transactions' | 'categories';

const ATK: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [inventory, setInventory] = useState<ATKItem[]>([]);
  const [categories, setCategories] = useState<ATKCategory[]>([]);
  const [requests, setRequests] = useState<ATKRequest[]>([]);
  const [transactions, setTransactions] = useState<ATKStockTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'item' | 'category' | 'request' | 'stockIn' | 'approve'>('item');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load each independently to handle partial failures
      const [categoriesData, itemsData, requestsData, transactionsData] = await Promise.all([
        atkCategoryService.getAll().catch(() => []),
        atkItemService.getAll().catch(() => []),
        atkRequestService.getAll().catch(() => []),
        atkTransactionService.getAll().catch(() => [])
      ]);
      setCategories(categoriesData);
      setInventory(itemsData);
      setRequests(requestsData);
      setTransactions(transactionsData);
      
      // Show warning if no data loaded
      if (categoriesData.length === 0 && itemsData.length === 0) {
        setError('No data found. Please run the SQL schema in Supabase first.');
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data. Please check Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  // Stats calculations
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(i => i.stock <= i.min_stock).length;
  const totalValue = inventory.reduce((sum, i) => sum + (i.stock * i.unit_price), 0);
  const pendingRequests = requests.filter(r => r.status === 'Submitted').length;

  // Filter functions
  const filteredInventory = inventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || item.category_id.toString() === filterCategory;
    return matchSearch && matchCategory;
  });

  const filteredRequests = requests.filter(req => {
    const matchSearch = req.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       req.request_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Handlers
  const openModal = (type: typeof modalType, item?: any) => {
    setModalType(type);
    setSelectedItem(item || null);
    setShowModal(true);
  };

  const handleApproveRequest = async (reqId: number, approved: boolean) => {
    try {
      const request = requests.find(r => r.id === reqId);
      if (!request) return;

      if (approved) {
        await atkRequestService.approve(reqId, 'Admin GA', request.items);
      } else {
        await atkRequestService.reject(reqId, 'Admin GA', 'Insufficient stock or invalid request');
      }
      // Reload data
      await loadData();
    } catch (err: any) {
      console.error('Error processing request:', err);
      alert('Error: ' + err.message);
    }
  };

  const handleStockIn = async (itemId: number, quantity: number, notes: string) => {
    try {
      await atkTransactionService.create({
        item_id: itemId,
        transaction_type: 'IN',
        quantity: quantity,
        reference_type: 'PURCHASE',
        notes: notes,
        created_by: 'Admin'
      });
      await loadData();
      setShowModal(false);
    } catch (err: any) {
      console.error('Error adding stock:', err);
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await atkItemService.delete(id);
      await loadData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await atkCategoryService.delete(id);
      await loadData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-700',
      'Submitted': 'bg-amber-100 text-amber-700',
      'Approved': 'bg-emerald-100 text-emerald-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Completed': 'bg-blue-100 text-blue-700',
      'Cancelled': 'bg-gray-100 text-gray-500',
      'Partial': 'bg-orange-100 text-orange-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-medium">Error loading data</p>
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">ATK Management</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola inventaris alat tulis kantor dan permintaan karyawan</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={() => openModal(activeTab === 'inventory' ? 'item' : activeTab === 'categories' ? 'category' : 'request')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md transition-all text-sm font-medium"
          >
            <Plus size={16} />
            {activeTab === 'inventory' ? 'Add Item' : activeTab === 'categories' ? 'Add Category' : activeTab === 'requests' ? 'New Request' : 'Add'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Alert</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <BarChart3 className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold text-amber-600">{pendingRequests}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <ClipboardList className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
        {[
          { key: 'inventory', label: 'Inventory', icon: Package },
          { key: 'requests', label: 'Requests', icon: ClipboardList, badge: pendingRequests },
          { key: 'transactions', label: 'Transactions', icon: ArrowUpDown },
          { key: 'categories', label: 'Categories', icon: Box },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap
              ${activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex gap-3">
          {activeTab === 'inventory' && (
            <>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button 
                onClick={() => openModal('stockIn')}
                className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
              >
                <TrendingUp size={16} />
                Stock In
              </button>
            </>
          )}
          {activeTab === 'requests' && (
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{item.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Package size={18} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.category_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${item.stock <= item.min_stock ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.stock}
                        </span>
                        <span className="text-xs text-gray-400">/ min: {item.min_stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.unit_price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.stock <= item.min_stock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle size={12} />
                          Low Stock
                        </span>
                      ) : item.stock >= item.max_stock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Overstock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Request No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{req.request_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{req.employee_name}</p>
                        <p className="text-xs text-gray-500">{req.department}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {req.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span className="font-medium">{item.quantity_requested}x</span>
                            <span>{item.item_name}</span>
                          </div>
                        ))}
                        {req.items.length > 2 && (
                          <span className="text-xs text-gray-400">+{req.items.length - 2} more items</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900">{req.request_date}</p>
                        {req.needed_date && (
                          <p className="text-xs text-gray-500">Need by: {req.needed_date}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {req.status === 'Submitted' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleApproveRequest(req.id, true)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-medium"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button 
                            onClick={() => handleApproveRequest(req.id, false)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-medium"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <Eye size={16} />
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

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock Change</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.created_at}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${tx.transaction_type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 
                          tx.transaction_type === 'OUT' ? 'bg-red-100 text-red-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {tx.transaction_type === 'IN' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.item_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${tx.transaction_type === 'IN' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tx.transaction_type === 'IN' ? '+' : '-'}{tx.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tx.previous_stock} → {tx.new_stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900">{tx.reference_type}</p>
                        <p className="text-xs text-gray-500">{tx.notes}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.created_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items Count</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{cat.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Box size={18} className="text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cat.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {inventory.filter(i => i.category_id === cat.id).length} items
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock In Modal */}
      {showModal && modalType === 'stockIn' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Stock In</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const itemId = parseInt((form.elements.namedItem('item') as HTMLSelectElement).value);
              const quantity = parseInt((form.elements.namedItem('quantity') as HTMLInputElement).value);
              const notes = (form.elements.namedItem('notes') as HTMLInputElement).value;
              handleStockIn(itemId, quantity, notes);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Item</label>
                  <select name="item" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="">-- Select Item --</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>{item.code} - {item.name} (Stock: {item.stock})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" name="quantity" min="1" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Reference</label>
                  <input type="text" name="notes" placeholder="PO Number, Invoice, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showModal && modalType === 'item' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Item</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const newItem = {
                code: (form.elements.namedItem('code') as HTMLInputElement).value,
                name: (form.elements.namedItem('name') as HTMLInputElement).value,
                category_id: parseInt((form.elements.namedItem('category') as HTMLSelectElement).value),
                unit: (form.elements.namedItem('unit') as HTMLInputElement).value,
                unit_price: parseFloat((form.elements.namedItem('price') as HTMLInputElement).value) || 0,
                stock: parseInt((form.elements.namedItem('stock') as HTMLInputElement).value) || 0,
                min_stock: parseInt((form.elements.namedItem('minStock') as HTMLInputElement).value) || 5,
                max_stock: parseInt((form.elements.namedItem('maxStock') as HTMLInputElement).value) || 100,
                location: (form.elements.namedItem('location') as HTMLInputElement).value,
                is_active: true,
              };
              atkItemService.create(newItem).then(() => {
                loadData();
                setShowModal(false);
              }).catch(err => alert('Error: ' + err.message));
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input type="text" name="code" required placeholder="ATK-XXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select name="category" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="">-- Select --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                  <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                  <input type="text" name="unit" required placeholder="Pcs, Box, Rim, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                  <input type="number" name="price" min="0" placeholder="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                  <input type="number" name="stock" min="0" defaultValue="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" name="location" placeholder="Gudang A" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                  <input type="number" name="minStock" min="0" defaultValue="5" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                  <input type="number" name="maxStock" min="0" defaultValue="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showModal && modalType === 'request' && (
        <NewRequestModal 
          inventory={inventory}
          onClose={() => setShowModal(false)}
          onSubmit={async (newRequest) => {
            try {
              await atkRequestService.create(newRequest);
              await loadData();
              setShowModal(false);
            } catch (err: any) {
              alert('Error: ' + err.message);
            }
          }}
        />
      )}

      {/* Add Category Modal */}
      {showModal && modalType === 'category' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Category</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const newCat = {
                code: (form.elements.namedItem('code') as HTMLInputElement).value,
                name: (form.elements.namedItem('name') as HTMLInputElement).value,
                description: (form.elements.namedItem('description') as HTMLInputElement).value,
              };
              atkCategoryService.create(newCat).then(() => {
                loadData();
                setShowModal(false);
              }).catch(err => alert('Error: ' + err.message));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input type="text" name="code" required placeholder="CAT-XXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" name="description" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// New Request Modal Component
interface NewRequestModalProps {
  inventory: ATKItem[];
  onClose: () => void;
  onSubmit: (request: Partial<ATKRequest>) => void;
}

const NewRequestModal: React.FC<NewRequestModalProps> = ({ inventory, onClose, onSubmit }) => {
  const [items, setItems] = useState<ATKRequestItem[]>([]);
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('');
  const [neededDate, setNeededDate] = useState('');
  const [purpose, setPurpose] = useState('');

  const addItem = () => {
    setItems([...items, {
      item_id: 0,
      quantity_requested: 1,
      quantity_approved: 0,
      quantity_issued: 0,
      status: 'Pending'
    }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === 'item_id') {
      const selectedItem = inventory.find(i => i.id === parseInt(value));
      newItems[index] = {
        ...newItems[index],
        item_id: parseInt(value),
        item_name: selectedItem?.name,
        item_code: selectedItem?.code,
        unit: selectedItem?.unit,
        available_stock: selectedItem?.stock
      };
    } else {
      (newItems[index] as any)[field] = value;
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }
    
    const newRequest: Partial<ATKRequest> = {
      employee_name: employeeName,
      department: department,
      request_date: new Date().toISOString().split('T')[0],
      needed_date: neededDate,
      purpose: purpose,
      status: 'Submitted',
      items: items.filter(i => i.item_id > 0)
    };
    
    onSubmit(newRequest);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-4">New ATK Request</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
              <input 
                type="text" 
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">-- Select --</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Legal">Legal</option>
                <option value="Management">Management</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Needed Date</label>
              <input 
                type="date" 
                value={neededDate}
                onChange={(e) => setNeededDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
              <input 
                type="text" 
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Monthly supplies, Project, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" 
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">Request Items</h4>
              <button 
                type="button" 
                onClick={addItem}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
            
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <Package size={32} className="mx-auto mb-2 opacity-50" />
                <p>No items added yet</p>
                <button 
                  type="button" 
                  onClick={addItem}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Click to add item
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <select 
                        value={item.item_id}
                        onChange={(e) => updateItem(index, 'item_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="0">-- Select Item --</option>
                        {inventory.filter(i => i.is_active).map(inv => (
                          <option key={inv.id} value={inv.id}>
                            {inv.code} - {inv.name} (Stock: {inv.stock} {inv.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <input 
                        type="number" 
                        min="1"
                        value={item.quantity_requested}
                        onChange={(e) => updateItem(index, 'quantity_requested', parseInt(e.target.value))}
                        placeholder="Qty"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ATK;
