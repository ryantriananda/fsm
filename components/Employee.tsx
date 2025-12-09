
import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, MoreHorizontal, Briefcase, Mail, X, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Employee } from '../types';
import { employeeService } from '../services/supabaseService';

const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Employee>>({
    nik: '',
    name: '',
    department: 'IT',
    position: '',
    joinDate: '',
    status: 'Active',
    email: ''
  });

  // Filter Logic
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.nik.includes(searchTerm)
  );

  // Handlers
  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingId(employee.id);
      setFormData(employee);
    } else {
      setEditingId(null);
      setFormData({
        nik: '',
        name: '',
        department: 'IT',
        position: '',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        email: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing
      setEmployees(employees.map(emp => 
        emp.id === editingId ? { ...formData, id: editingId } as Employee : emp
      ));
    } else {
      // Create new
      const newEmployee: Employee = {
        ...formData as Employee,
        id: `E${Math.floor(Math.random() * 10000)}` // Simple random ID
      };
      setEmployees([...employees, newEmployee]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee record?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Employee Master</h2>
            <p className="text-gray-500 text-sm mt-1">Manage employee data, profiles, and statuses.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-md"
        >
            <Plus size={16} /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, NIK, or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase">
                        {emp.name.charAt(0)}{emp.name.split(' ')[1]?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{emp.name}</div>
                        <div className="text-xs text-gray-500">NIK: {emp.nik}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Briefcase size={14} className="text-gray-400" />
                        {emp.position}
                     </div>
                     <div className="text-xs text-gray-500 pl-6">{emp.department}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {emp.email}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                          'bg-gray-50 text-gray-600 border-gray-100'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(emp)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(emp.id)}
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                    <input 
                      required
                      type="text" 
                      value={formData.nik}
                      onChange={(e) => setFormData({...formData, nik: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                    <input 
                      required
                      type="date" 
                      value={formData.joinDate}
                      onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    placeholder="john@modena.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select 
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none bg-white"
                    >
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Legal">Legal</option>
                      <option value="Management">Management</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Resigned">Resigned</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input 
                    required
                    type="text" 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    placeholder="e.g. Senior Developer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium shadow-md transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;
