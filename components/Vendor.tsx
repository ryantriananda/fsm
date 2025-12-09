
import React, { useState } from 'react';
import { Star, Phone, Mail, MapPin, Search, Plus, MoreHorizontal, Edit2, Trash2, X, Filter, Download, User } from 'lucide-react';
import { Vendor } from '../types';

const initialVendors: Vendor[] = [
  { id: 'V1', name: 'CleanMaster Pro', serviceType: 'Cleaning', contactPerson: 'Alice Cooper', phone: '+62 812-3456-7890', email: 'alice@cleanmaster.com', address: 'Jl. Sudirman No. 45, Jakarta', rating: 4.8, status: 'Active' },
  { id: 'V2', name: 'Guardian Security', serviceType: 'Security', contactPerson: 'Bob Shield', phone: '+62 811-9876-5432', email: 'contact@guardiansec.com', address: 'Jl. Gatot Subroto Kav 12, Jakarta', rating: 4.5, status: 'Active' },
  { id: 'V3', name: 'TechSolutions Inc', serviceType: 'IT Support', contactPerson: 'Charlie Root', phone: '+62 813-5555-1212', email: 'support@techsol.com', address: 'Ruko Mangga Dua Blok A1', rating: 3.9, status: 'Inactive' },
];

const VendorPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    serviceType: 'Supplier',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    rating: 5,
    status: 'Active'
  });

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (vendor?: Vendor) => {
    if (vendor) {
      setEditingId(vendor.id);
      setFormData(vendor);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        serviceType: 'Supplier',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        rating: 5,
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setVendors(vendors.map(v => v.id === editingId ? { ...formData, id: editingId } as Vendor : v));
    } else {
      const newVendor: Vendor = {
        ...formData as Vendor,
        id: `V${Math.floor(Math.random() * 10000)}`
      };
      setVendors([newVendor, ...vendors]);
    }
    handleCloseModal();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Management</h2>
            <p className="text-gray-500 text-sm mt-1">Manage external partners, service providers, and suppliers.</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm">
                <Download size={16} /> Export
            </button>
            <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-md"
            >
                <Plus size={16} /> Add Vendor
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, type, or contact..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-900 text-white">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Vendor Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Service Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Contact Person</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Contact Info</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Rating</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredVendors.map((vendor) => (
                        <tr key={vendor.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">{vendor.name}</div>
                                <div className="text-xs text-gray-500">ID: {vendor.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {vendor.serviceType}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                        {vendor.contactPerson.charAt(0)}
                                    </div>
                                    <span className="text-sm text-gray-700">{vendor.contactPerson}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    {vendor.email && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Mail size={12} /> {vendor.email}
                                        </div>
                                    )}
                                    {vendor.phone && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Phone size={12} /> {vendor.phone}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span className="text-sm font-bold text-gray-900 mr-1">{vendor.rating}</span>
                                    <Star size={14} fill="currentColor" />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {vendor.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenModal(vendor)}
                                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(vendor.id)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Vendor' : 'Add New Vendor'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    placeholder="e.g. CleanMaster Pro"
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                    <select 
                        value={formData.serviceType}
                        onChange={(e) => setFormData({...formData, serviceType: e.target.value as any})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none bg-white"
                    >
                        <option value="Supplier">Supplier</option>
                        <option value="Cleaning">Cleaning Service</option>
                        <option value="Security">Security</option>
                        <option value="IT Support">IT Support</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none bg-white"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">Contact Information</h4>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            required
                            type="text" 
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                            placeholder="e.g. John Smith"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                            placeholder="+62 ..."
                        />
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                            placeholder="contact@vendor.com"
                        />
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                            placeholder="Full address..."
                        />
                    </div>
                </div>

                <div className="col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Initial Rating (1-5)</label>
                     <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData({...formData, rating: star})}
                                className={`p-1 rounded-md transition-colors ${
                                    (formData.rating || 0) >= star ? 'text-amber-500' : 'text-gray-300'
                                }`}
                            >
                                <Star size={24} fill="currentColor" />
                            </button>
                        ))}
                     </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium shadow-md transition-colors"
                >
                  {editingId ? 'Update Vendor' : 'Create Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorPage;
