
import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, XCircle, Sparkles, MapPin, Plus, X } from 'lucide-react';
import { TimesheetEntry } from '../types';

const cleaningMockData: TimesheetEntry[] = [
  { id: 'C1', employee_name: 'Budi Santoso', date: '2023-10-27', zone_area: 'Lobby & Reception', activity_task: 'Morning Shift - Deep Clean', hours: 8, status: 'Approved' },
  { id: 'C2', employee_name: 'Siti Aminah', date: '2023-10-27', zone_area: 'Restrooms Lt. 1-3', activity_task: 'Hourly Sanitation Check', hours: 8, status: 'Submitted' },
  { id: 'C3', employee_name: 'Agus Setiawan', date: '2023-10-27', zone_area: 'Meeting Rooms', activity_task: 'Post-event Cleanup', hours: 4, status: 'Approved' },
  { id: 'C4', employee_name: 'Rina Wati', date: '2023-10-27', zone_area: 'Pantry & Breakroom', activity_task: 'General Cleaning & Restock', hours: 8, status: 'Submitted' },
];

const Timesheet: React.FC = () => {
  const [cleaningLogs, setCleaningLogs] = useState<TimesheetEntry[]>(cleaningMockData);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_name: '',
    date: new Date().toISOString().split('T')[0],
    zone_area: '', 
    activity_task: '',
    hours: 8 as number | string
  });

  // Stats calculation
  const totalHours = cleaningLogs.reduce((acc, curr) => acc + curr.hours, 0);
  const pendingCount = cleaningLogs.filter(d => d.status === 'Submitted').length;
  const coverageMetric = '100% Area'; 

  const handleOpenModal = () => {
    setFormData({
        employee_name: '',
        date: new Date().toISOString().split('T')[0],
        zone_area: '',
        activity_task: '',
        hours: 8
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TimesheetEntry = {
        id: `C${Math.random().toString(36).substr(2, 5)}`,
        employee_name: formData.employee_name,
        date: formData.date,
        zone_area: formData.zone_area,
        activity_task: formData.activity_task,
        hours: Number(formData.hours),
        status: 'Submitted'
    };

    setCleaningLogs([newEntry, ...cleaningLogs]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Cleaning Service Timesheet</h2>
          <p className="text-gray-500 text-sm mt-1">Track cleaning staff shifts, zones, and activities.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleOpenModal}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-md transition-colors"
            >
                <Plus size={16} />
                Log Cleaning Shift
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">Total Hours (Daily)</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalHours}h</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <Clock size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">Pending Approval</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{pendingCount}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Calendar size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">
                  Area Coverage
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{coverageMetric}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <MapPin size={24} />
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">
              Shift Logs
            </h3>
            <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 flex items-center gap-1">
                <Sparkles size={12} />
                Cleaning Dept
            </span>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                    Zone / Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                    Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {cleaningLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{entry.employee_name}</div>
                    <div className="text-xs text-gray-400">ID: {entry.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{entry.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400"/>
                            <span className="font-medium text-gray-900">{entry.zone_area}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{entry.activity_task}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{entry.hours}h</td>
                    <td className="px-6 py-4">
                    {entry.status === 'Approved' && <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase"><CheckCircle size={14}/> Approved</span>}
                    {entry.status === 'Rejected' && <span className="flex items-center gap-1 text-rose-600 text-xs font-bold uppercase"><XCircle size={14}/> Rejected</span>}
                    {entry.status === 'Submitted' && <span className="flex items-center gap-1 text-blue-600 text-xs font-bold uppercase"><Clock size={14}/> Submitted</span>}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

       {/* Add Entry Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Log Cleaning Shift
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Name
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.employee_name}
                    onChange={(e) => setFormData({...formData, employee_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    placeholder="e.g., Budi Santoso"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    required
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone / Area
                  </label>
                  <select 
                      required
                      value={formData.zone_area}
                      onChange={(e) => setFormData({...formData, zone_area: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none bg-white"
                  >
                      <option value="">Select Zone</option>
                      <option value="Lobby & Reception">Lobby & Reception</option>
                      <option value="Restrooms Lt. 1-3">Restrooms Lt. 1-3</option>
                      <option value="Meeting Rooms">Meeting Rooms</option>
                      <option value="Pantry & Breakroom">Pantry & Breakroom</option>
                      <option value="Outdoor Area">Outdoor Area</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cleaning Activity
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.activity_task}
                    onChange={(e) => setFormData({...formData, activity_task: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    placeholder="e.g., Deep Clean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours / Duration</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    step="0.5"
                    value={formData.hours}
                    onChange={(e) => setFormData({...formData, hours: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                  />
                </div>
              </div>

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
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium shadow-md transition-colors"
                >
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timesheet;
