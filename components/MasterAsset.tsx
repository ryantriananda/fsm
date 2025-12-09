
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Filter, Download, Loader2, AlertCircle, Info } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { Asset } from '../types';

const initialAssets: Asset[] = [
  { id: '1', asset_code: 'AST-001', name: 'MacBook Pro M2', category_name: 'Electronics', serial_number: 'MBP2023-001', purchase_date: '2023-01-15', acquisition_cost: 2500, residual_value: 200, depreciation_method: 'Straight Line', status: 'Active', condition: 'Good', location_name: 'HQ - Design Team' },
  { id: '2', asset_code: 'AST-002', name: 'Herman Miller Aeron', category_name: 'Furniture', serial_number: 'HMA-9921', purchase_date: '2022-11-20', acquisition_cost: 1200, residual_value: 100, depreciation_method: 'Straight Line', status: 'Active', condition: 'Good', location_name: 'HQ - CEO Office' },
];

const MasterAsset: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Asset>>({
    asset_code: '',
    name: '',
    category_id: '',
    serial_number: '',
    purchase_date: '',
    acquisition_cost: 0,
    residual_value: 0,
    depreciation_method: 'Straight Line',
    status: 'Active',
    condition: 'Good',
    location_id: ''
  });

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    setUsingMockData(false);
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setAssets(data);
    } catch (err: any) {
      console.warn('[Supabase] Assets table unavailable. Using local mock data.');
      setAssets(initialAssets);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleOpenModal = (asset?: Asset) => {
    setError(null);
    if (asset) {
      setEditingAsset(asset);
      setFormData(asset);
    } else {
      setEditingAsset(null);
      setFormData({
        asset_code: '',
        name: '',
        category_id: '',
        serial_number: '',
        purchase_date: new Date().toISOString().split('T')[0],
        acquisition_cost: 0,
        residual_value: 0,
        depreciation_method: 'Straight Line',
        status: 'Active',
        condition: 'Good',
        location_id: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
        if (usingMockData) {
            setAssets(assets.filter(a => a.id !== id));
            return;
        }

        try {
            const { error } = await supabase.from('assets').delete().eq('id', id);
            if (error) throw error;
            setAssets(assets.filter(a => a.id !== id));
        } catch (err: any) {
            console.error('Delete failed', err);
            setAssets(assets.filter(a => a.id !== id));
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Check for unique Asset Code locally first
    const isDuplicate = assets.some(a => 
      a.asset_code === formData.asset_code && 
      (editingAsset ? a.id !== editingAsset.id : true)
    );

    if (isDuplicate) {
      alert('Asset Code must be unique. Please use a different code.');
      setSubmitting(false);
      return;
    }

    if (usingMockData) {
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
        if (editingAsset) {
            setAssets(assets.map(a => a.id === editingAsset.id ? { ...formData, id: editingAsset.id } as Asset : a));
        } else {
            const newAsset = { 
                ...formData, 
                id: Math.random().toString(36).substr(2, 9),
                category_name: 'Mock Category', 
                location_name: 'Mock Location' 
            } as Asset;
            setAssets([newAsset, ...assets]);
        }
        setSubmitting(false);
        handleCloseModal();
        return;
    }

    try {
        if (editingAsset) {
            // Update
            const { data, error } = await supabase
                .from('assets')
                .update(formData)
                .eq('id', editingAsset.id)
                .select();
            
            if (error) throw error;
            if (data) {
                 setAssets(assets.map(a => a.id === editingAsset.id ? data[0] : a));
            }
        } else {
            // Create
            const { id, category_name, location_name, ...newAssetData } = formData as any; // Exclude UI fields
            const { data, error } = await supabase
                .from('assets')
                .insert([newAssetData])
                .select();

            if (error) throw error;
             if (data) {
                 setAssets([data[0], ...assets]);
            }
        }
        handleCloseModal();
    } catch (err: any) {
        console.error('Save failed:', err);
         if (editingAsset) {
            setAssets(assets.map(a => a.id === editingAsset.id ? { ...formData, id: editingAsset.id } as Asset : a));
         } else {
            const newAsset = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Asset;
            setAssets([newAsset, ...assets]);
         }
         handleCloseModal();
    } finally {
        setSubmitting(false);
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Maintenance': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Disposed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Daftar Asset</h2>
          <p className="text-gray-500 text-sm mt-1">Manage, track, and audit organizational assets.</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={fetchAssets} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Refresh'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md hover:shadow-lg transition-all text-sm font-medium"
          >
            <Plus size={16} />
            Add New Asset
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6 flex items-center gap-2 border border-amber-200">
            <AlertCircle size={20} />
            {error}
        </div>
      )}

      {usingMockData && !error && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 flex items-center gap-2 border border-blue-100 text-sm animate-fade-in">
            <Info size={20} />
            <span>
                <strong>Demo Mode Active:</strong> Using local data because the database table <code>assets</code> was not found. Changes will not be saved permanently.
            </span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by code, name, or serial..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors">
          <Filter size={16} />
          More Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Asset Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Asset Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Serial Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Condition</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Acq. Cost</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading && assets.length === 0 ? (
                 <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        <Loader2 className="animate-spin mx-auto mb-2" />
                        Loading assets from Supabase...
                    </td>
                 </tr>
              ) : filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 transition-colors group">
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 font-medium">
                        {asset.asset_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{asset.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Purchased: {asset.purchase_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {asset.category_name || asset.category_id || '-'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono tracking-tight">{asset.serial_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{asset.location_name || asset.location_id || '-'}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{asset.condition}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${Number(asset.acquisition_cost).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(asset)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(asset.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                            <Search size={24} className="text-gray-400"/>
                        </div>
                        <p className="text-sm font-medium text-gray-900">No assets found</p>
                        <p className="text-xs text-gray-500 mt-1">Try adjusting your search terms.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAsset ? 'Edit Asset' : 'Add New Asset'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Code <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={formData.asset_code}
                    onChange={(e) => setFormData({...formData, asset_code: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all font-mono"
                    placeholder="e.g., AST-001"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be unique.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category (ID)</label>
                  <input 
                    type="text"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    placeholder="e.g. UUID or Name for demo"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., MacBook Pro M2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                  <input 
                    required
                    type="text" 
                    value={formData.serial_number}
                    onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    placeholder="e.g., SN-123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                  <input 
                    required
                    type="date" 
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Acquisition Cost ($)</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    value={formData.acquisition_cost}
                    onChange={(e) => setFormData({...formData, acquisition_cost: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Residual Value ($)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.residual_value}
                    onChange={(e) => setFormData({...formData, residual_value: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="In Maintenance">In Maintenance</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
                
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select 
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white"
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location (ID)</label>
                  <input 
                    type="text" 
                    value={formData.location_id}
                    onChange={(e) => setFormData({...formData, location_id: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    placeholder="e.g., UUID or Name for demo"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium shadow-md transition-colors flex items-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  {usingMockData ? 'Save (Demo)' : (editingAsset ? 'Update Asset' : 'Create Asset')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterAsset;
