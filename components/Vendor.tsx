
import React from 'react';
import { Star, Phone, MoreHorizontal, User } from 'lucide-react';
import { Vendor } from '../types';

const mockVendors: Vendor[] = [
  { id: 'V1', name: 'CleanMaster Pro', serviceType: 'Cleaning', contactPerson: 'Alice Cooper', rating: 4.8, status: 'Active' },
  { id: 'V2', name: 'Guardian Security', serviceType: 'Security', contactPerson: 'Bob Shield', rating: 4.5, status: 'Active' },
  { id: 'V3', name: 'TechSolutions Inc', serviceType: 'IT Support', contactPerson: 'Charlie Root', rating: 3.9, status: 'Inactive' },
];

const VendorPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Management</h2>
            <p className="text-gray-500 text-sm mt-1">Manage external partners, evaluate performance.</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
            Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-full text-gray-600">
                    <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                  <span className="text-xs text-gray-500 uppercase font-medium">{vendor.serviceType}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
            </div>
            
            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Phone size={14}/> Contact</span>
                    <span className="font-medium text-gray-900">{vendor.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Star size={14}/> Rating</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <span>{vendor.rating}</span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} fill={i < Math.floor(vendor.rating) ? "currentColor" : "none"} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                    {vendor.status}
                </span>
                <button className="text-sm text-indigo-600 font-medium hover:underline">View Contracts</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorPage;
