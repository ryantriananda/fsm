import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Download, Loader2, AlertCircle, Eye } from 'lucide-react';
import { assetService, assetCategoryService, assetLocationService, assetStatusService, vendorService } from '../services/supabaseService';

const MasterAsset: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = {
    code: '', name: '', category_id: '', location_id: '', status_id: '', vendor_id: '',
    serial_number: '', purchase_date: new Date().toISOString().split('T')[0],
    acquisition_cost: 0, book_value: 0
  };
  const [formData, setFormData] = useState(emptyForm);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [a, c, l, s, v] = await Promise.all([
        assetService.getAllWithRelations(),
        assetCategoryService.getAll(),
        assetLocationService.getAll(),
        assetStatusService.getAll(),
        vendorService.getAll()
      ]);
      setAssets(a);
      setCategories(c);
      setLocations(l);
      setStatuses(s);
      setVendors(v);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (asset?: any, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (asset) {
      setEditingAsset(asset);
      setFormData({
        code: asset.code,
        name: asset.name,
        category_id: asset.category_id || '',
        location_id: asset.location_id || '',
        status_id: asset.status_id || '',
        vendor_id: asset.vendor_id || '',
        serial_number: asset.serial_number || '',
        purchase_date: asset.purchase_date || '',
        acquisition_cost: asset.acquisition_cost || 0,
        book_value: asset.book_value || 0
      });
    } else {
      setEditingAsset(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
    setIsViewMode(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus asset ini?')) {
      try {
        await assetService.delete(id);
        fetchData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      category_id: formData.category_id ? Number(formData.category_id) : null,
      location_id: formData.location_id ? Number(formData.location_id) : null,
      status_id: formData.status_id ? Number(formData.status_id) : null,
      vendor_id: formData.vendor_id ? Number(formData.vendor_id) : null
    };
    try {
      if (editingAsset) {
        await assetService.update(editingAsset.id, payload);
      } else {
        await assetService.create(payload);
      }
      fetchData();
      handleCloseModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = assets.filter(a =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (s: string) => {
    if (s === 'Active') return 'bg-emerald-100 text-emerald-800';
    if (s === 'In Maintenance') return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daftar Asset</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola dan pantau aset organisasi</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm">
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Refresh'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm">
            <Download size={16} />Export
          </button>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md text-sm font-medium">
            <Plus size={16} />Tambah Asset
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6 flex items-center gap-2 border border-amber-200">
          <AlertCircle size={20} />{error}
        </div>
      )}

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input type="text" placeholder="Cari kode atau nama asset..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Kode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Nama Asset</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Kategori</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Lokasi</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Harga</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading && assets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="animate-spin mx-auto mb-2" />Loading...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map(asset => (
                  <tr key={asset.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">{asset.code}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{asset.name}</div>
                      <div className="text-xs text-gray-500">SN: {asset.serial_number || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{asset.category_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{asset.location_name || '-'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Rp {Number(asset.acquisition_cost || 0).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status_name)}`}>
                        {asset.status_name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(asset, true)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="Lihat">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleOpenModal(asset)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(asset.id)} className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Search size={24} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium">Tidak ada asset ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">Menampilkan {filtered.length} dari {assets.length} asset</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {isViewMode ? 'Detail Asset' : editingAsset ? 'Edit Asset' : 'Tambah Asset'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Asset *</label>
                  <input required disabled={isViewMode} value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100" placeholder="AST-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select disabled={isViewMode} value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100">
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Asset *</label>
                  <input required disabled={isViewMode} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100" placeholder="Laptop Dell XPS" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input disabled={isViewMode} value={formData.serial_number} onChange={e => setFormData({...formData, serial_number: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pembelian</label>
                  <input type="date" disabled={isViewMode} value={formData.purchase_date} onChange={e => setFormData({...formData, purchase_date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Perolehan (Rp)</label>
                  <input type="number" disabled={isViewMode} value={formData.acquisition_cost} onChange={e => setFormData({...formData, acquisition_cost: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Buku (Rp)</label>
                  <input type="number" disabled={isViewMode} value={formData.book_value} onChange={e => setFormData({...formData, book_value: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                  <select disabled={isViewMode} value={formData.location_id} onChange={e => setFormData({...formData, location_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100">
                    <option value="">-- Pilih Lokasi --</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.building} - {l.room}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select disabled={isViewMode} value={formData.status_id} onChange={e => setFormData({...formData, status_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100">
                    <option value="">-- Pilih Status --</option>
                    {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                  <select disabled={isViewMode} value={formData.vendor_id} onChange={e => setFormData({...formData, vendor_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100">
                    <option value="">-- Pilih Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              </div>
              {!isViewMode && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Batal
                  </button>
                  <button type="submit" disabled={submitting} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2">
                    {submitting && <Loader2 className="animate-spin" size={16} />}
                    {editingAsset ? 'Update' : 'Simpan'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterAsset;