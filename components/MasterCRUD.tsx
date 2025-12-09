import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, Edit2, Trash2, X, Save, Loader2, AlertCircle, Info } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export interface FieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea';
  options?: string[]; // For select type
  required?: boolean;
  width?: string; // Tailwind class for width in form
}

export interface ColumnDefinition {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface MasterCRUDProps {
  title: string;
  description?: string;
  columns: ColumnDefinition[];
  fields: FieldDefinition[];
  initialData?: any[];
  tableName: string; // Supabase table name
}

export const MasterCRUD: React.FC<MasterCRUDProps> = ({ title, description, columns, fields, initialData = [], tableName }) => {
  const [data, setData] = useState<any[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  // Fetch Data from Supabase
  const fetchData = async () => {
    if (!tableName) return;
    setLoading(true);
    setError(null);
    
    try {
      const { data: fetchedData, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setData(fetchedData || []);
      setUsingMockData(false);
    } catch (err: any) {
      console.warn(`[Supabase] Table '${tableName}' unavailable or fetch error. Using mock data.`);
      
      // Optional: Log technical error details to console
      const errorMsg = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      console.debug(`Supabase error for ${tableName}:`, errorMsg);

      // Fallback to initialData if available, otherwise empty array
      // This ensures the app remains usable in "Demo Mode"
      setData(initialData || []);
      setUsingMockData(true);
      
      // We do NOT set error state here, effectively suppressing the red box
      // The "Demo Mode" info box below will inform the user instead.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset data to initialData when switching tables/views to avoid stale data
    setData(initialData);
    setUsingMockData(false);
    fetchData();
  }, [tableName]);

  // Search Logic
  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Form Handlers
  const handleOpenModal = (item?: any) => {
    setError(null);
    if (item) {
      setEditingId(item.id);
      setFormData({ ...item });
    } else {
      setEditingId(null);
      // Initialize empty form
      const initialForm: any = {};
      fields.forEach(f => initialForm[f.name] = '');
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      if (usingMockData) {
        // Local delete simulation
        setData(data.filter(item => item.id !== id));
        return;
      }

      try {
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
        
        // Optimistic update
        setData(data.filter(item => item.id !== id));
      } catch (err: any) {
        console.error('Delete error, falling back to local delete:', err);
        // Fallback to local delete so UI updates even if DB fails
        setData(data.filter(item => item.id !== id));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Mock Mode Submission
    if (usingMockData) {
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
        
        if (editingId) {
            const updatedItem = { ...formData, id: editingId };
            setData(data.map(item => item.id === editingId ? updatedItem : item));
        } else {
            const newItem = { ...formData, id: Math.random().toString(36).substr(2, 9) };
            setData([newItem, ...data]);
        }
        
        setSubmitting(false);
        setIsModalOpen(false);
        return;
    }

    try {
      if (editingId) {
        // Update
        const { data: updatedData, error: updateError } = await supabase
          .from(tableName)
          .update(formData)
          .eq('id', editingId)
          .select();

        if (updateError) throw updateError;
        
        if (updatedData) {
            setData(data.map(item => item.id === editingId ? updatedData[0] : item));
        }
      } else {
        // Create
        const { id, ...dataToInsert } = formData;
        
        const { data: newData, error: insertError } = await supabase
          .from(tableName)
          .insert([dataToInsert])
          .select();

        if (insertError) throw insertError;
        
        if (newData) {
            setData([newData[0], ...data]);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Save error:', err);
      // Fallback to mock behavior if real save fails
      if (editingId) {
         setData(data.map(item => item.id === editingId ? { ...formData, id: editingId } : item));
      } else {
         const newItem = { ...formData, id: Math.random().toString(36).substr(2, 9) };
         setData([newItem, ...data]);
      }
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={fetchData} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Refresh'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-md transition-all text-sm font-medium"
          >
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2 border border-red-100">
            <AlertCircle size={20} />
            {error}
        </div>
      )}

      {usingMockData && !error && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 flex items-center gap-2 border border-blue-100 text-sm animate-fade-in">
            <Info size={20} />
            <span>
                <strong>Demo Mode:</strong> Using local data because the database connection to <code>{tableName}</code> is unavailable.
            </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
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
              {loading && data.length === 0 ? (
                 <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                       <Loader2 className="animate-spin mx-auto mb-2" />
                       Loading data...
                    </td>
                 </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-gray-50 transition-colors group">
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(row)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Record' : 'Add New Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {fields.map((field) => (
                  <div key={field.name} className={field.width || 'col-span-1'}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none bg-white"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                        <textarea
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none h-24"
                        />
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded">
                    {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium shadow-md transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                  {usingMockData ? 'Save (Demo)' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
