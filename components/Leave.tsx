
import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Plus, Filter } from 'lucide-react';
import { LeaveRequest } from '../types';

const mockLeaves: LeaveRequest[] = [
  { id: 'L001', employeeName: 'John Doe', type: 'Annual', startDate: '2023-11-10', endDate: '2023-11-12', days: 3, reason: 'Family vacation', status: 'Approved' },
  { id: 'L002', employeeName: 'Sarah Jenkins', type: 'Sick', startDate: '2023-10-30', endDate: '2023-10-31', days: 2, reason: 'Flu', status: 'Approved' },
  { id: 'L003', employeeName: 'Mike Ross', type: 'Annual', startDate: '2023-12-24', endDate: '2023-12-31', days: 6, reason: 'Christmas Holiday', status: 'Pending' },
  { id: 'L004', employeeName: 'You (Admin)', type: 'Annual', startDate: '2024-01-05', endDate: '2024-01-06', days: 2, reason: 'Personal matters', status: 'Pending' },
];

const LeavePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-leaves' | 'approvals'>('approvals');
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaves);

  // Simulating "My Leaves" vs "Approvals" view
  // For demo: My Leaves shows requests where Name = 'You (Admin)', Approvals shows others
  const displayLeaves = activeTab === 'my-leaves' 
    ? leaves.filter(l => l.employeeName === 'You (Admin)') 
    : leaves.filter(l => l.employeeName !== 'You (Admin)');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Leave Management</h2>
            <p className="text-gray-500 text-sm mt-1">Manage time off requests and approvals.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-md">
            <Plus size={16} /> Request Leave
        </button>
      </div>

       {/* Tabs */}
       <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'approvals' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Manager Approvals
          <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {leaves.filter(l => l.status === 'Pending' && l.employeeName !== 'You (Admin)').length}
          </span>
          {activeTab === 'approvals' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('my-leaves')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'my-leaves' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          My History
          {activeTab === 'my-leaves' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full"></span>}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type & Reason</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {displayLeaves.length > 0 ? displayLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{leave.employeeName}</div>
                    <div className="text-xs text-gray-500">ID: {leave.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-700">{leave.type}</div>
                    <div className="text-xs text-gray-500 italic">"{leave.reason}"</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {leave.startDate} <span className="text-gray-400">to</span> {leave.endDate}
                    </div>
                    <div className="text-xs font-bold text-indigo-600 mt-1">{leave.days} Days</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 
                          leave.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                        {leave.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {activeTab === 'approvals' && leave.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                            <button className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Approve">
                                <CheckCircle size={18} />
                            </button>
                            <button className="p-1.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors" title="Reject">
                                <XCircle size={18} />
                            </button>
                        </div>
                    ) : (
                        <span className="text-gray-400 text-xs">View Details</span>
                    )}
                  </td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">
                          No leave requests found.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeavePage;
