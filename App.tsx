import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MasterAsset from './components/MasterAsset';
import ATK from './components/ATK';
import ARK from './components/ARK';
import Contract from './components/Contract';
import Timesheet from './components/Timesheet';
import Vendor from './components/Vendor';
import CreditCard from './components/CreditCard';
import LogBook from './components/LogBook';
import ProjectManagement from './components/ProjectManagement';
import { MasterCRUD } from './components/MasterCRUD';
import EmployeePage from './components/Employee';
import LeavePage from './components/Leave';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'atk': return <ATK />;
      case 'ark': return <ARK />;
      case 'timesheet': return <Timesheet />;
      case 'credit-card': return <CreditCard />;
      case 'log-book': return <LogBook />;
      case 'project-management': return <ProjectManagement />;
      
      // HR & Admin Routes
      case 'employees': return <EmployeePage />;
      case 'leave-requests': return <LeavePage />;
      case 'departments':
        return (
            <MasterCRUD 
                title="Departments"
                description="Manage organizational departments."
                tableName="departments"
                columns={[
                    { key: 'code', label: 'Dept Code' },
                    { key: 'name', label: 'Department Name', render: (val) => <span className="font-bold text-gray-900">{val}</span> },
                ]}
                fields={[
                    { name: 'code', label: 'Code', type: 'text', required: true },
                    { name: 'name', label: 'Name', type: 'text', required: true },
                ]}
                initialData={[
                    { id: 1, code: 'IT', name: 'Information Technology' },
                    { id: 2, code: 'HR', name: 'Human Resources' },
                    { id: 3, code: 'GA', name: 'General Affairs' },
                    { id: 4, code: 'FIN', name: 'Finance' },
                    { id: 5, code: 'MKT', name: 'Marketing' },
                ]}
            />
        );
      case 'users':
        return (
            <MasterCRUD 
                title="User Management"
                description="Manage system users and access roles."
                tableName="users"
                columns={[
                    { key: 'email', label: 'Email' },
                    { key: 'full_name', label: 'Full Name' },
                    { key: 'role', label: 'Role', render: (val) => <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">{val}</span> },
                    { key: 'status', label: 'Status', render: (val) => <span className={`px-2 py-0.5 rounded text-xs font-bold ${val === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{val}</span> },
                ]}
                fields={[
                    { name: 'email', label: 'Email', type: 'text', required: true },
                    { name: 'full_name', label: 'Full Name', type: 'text', required: true },
                    { name: 'role', label: 'Role', type: 'select', options: ['Admin', 'Manager', 'Staff', 'Viewer'] },
                    { name: 'department_id', label: 'Department ID', type: 'text' },
                    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
                    { name: 'password_hash', label: 'Password (Set/Reset)', type: 'text' },
                ]}
                initialData={[
                    { id: 1, email: 'admin@modena.com', full_name: 'System Admin', role: 'Admin', status: 'Active' },
                    { id: 2, email: 'manager@modena.com', full_name: 'Ops Manager', role: 'Manager', status: 'Active' },
                    { id: 3, email: 'staff@modena.com', full_name: 'GA Staff', role: 'Staff', status: 'Active' },
                ]}
            />
        );
      
      // Master Asset Sub-menus
      case 'asset-control':
      case 'asset-list': return <MasterAsset />;
      case 'vendor': return <Vendor />;
      case 'contract': return <Contract />;
      
      case 'asset-category':
        return (
            <MasterCRUD 
                title="Kategori Asset"
                description="Manage asset classifications, types, and depreciation rules."
                tableName="asset_categories"
                columns={[
                    { key: 'code', label: 'Kode' },
                    { key: 'name', label: 'Category Name', render: (val) => <span className="font-bold text-gray-900">{val}</span> },
                    { key: 'type', label: 'Type', render: (val) => <span className={`px-2 py-0.5 rounded text-xs font-medium ${val === 'Moveable' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{val}</span> },
                    { key: 'is_depreciable', label: 'Depreciation', render: (val) => val ? 'Yes' : 'No' },
                    { key: 'useful_life_years', label: 'Life (Years)' },
                ]}
                fields={[
                    { name: 'code', label: 'Category Code', type: 'text', required: true },
                    { name: 'name', label: 'Category Name', type: 'text', required: true },
                    { name: 'type', label: 'Type', type: 'select', options: ['Fix', 'Moveable'] },
                    { name: 'is_depreciable', label: 'Depreciation?', type: 'select', options: ['true', 'false'] },
                    { name: 'useful_life_years', label: 'Useful Life (Years)', type: 'number' }
                ]}
                initialData={[
                    { id: 1, code: 'CAT-001', name: 'Electronics', type: 'Moveable', is_depreciable: true, useful_life_years: 4 },
                    { id: 2, code: 'CAT-002', name: 'Furniture', type: 'Fix', is_depreciable: true, useful_life_years: 8 },
                ]}
            />
        );

      case 'asset-location':
        return (
            <MasterCRUD 
                title="Lokasi Asset"
                description="Manage buildings, floors, rooms, and location codes."
                tableName="asset_locations"
                columns={[
                    { key: 'code', label: 'Loc Code' },
                    { key: 'building', label: 'Building' },
                    { key: 'room_name', label: 'Room' },
                    { key: 'pic_name', label: 'PIC' },
                ]}
                fields={[
                    { name: 'code', label: 'Location Code', type: 'text', required: true },
                    { name: 'building', label: 'Building Name', type: 'text' },
                    { name: 'floor', label: 'Floor', type: 'text' },
                    { name: 'room_name', label: 'Room Name', type: 'text', required: true },
                    { name: 'pic_name', label: 'Person In Charge', type: 'text' }
                ]}
                initialData={[
                    { id: 1, code: 'HQ-L2-01', building: 'Headquarters', floor: '2nd Floor', room_name: 'Server Room', pic_name: 'IT Admin' },
                    { id: 2, code: 'HQ-L1-05', building: 'Headquarters', floor: '1st Floor', room_name: 'Lobby', pic_name: 'Receptionist' },
                ]}
            />
        );

      case 'asset-status':
        return (
            <MasterCRUD 
                title="Status Asset"
                description="Define asset lifecycles and reporting statuses."
                tableName="asset_statuses" // Note: This might not be in FSD DDL, but useful as reference
                columns={[
                    { key: 'code', label: 'Code' },
                    { key: 'name', label: 'Status Name', render: (val) => <span className="font-semibold text-gray-800">{val}</span> },
                    { key: 'description', label: 'Description' },
                ]}
                fields={[
                    { name: 'code', label: 'Status Code', type: 'text', required: true },
                    { name: 'name', label: 'Status Name', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                ]}
                initialData={[
                    { id: 1, code: 'ACT', name: 'Active', description: 'Asset is in use' },
                    { id: 2, code: 'MNT', name: 'In Maintenance', description: 'Undergoing repair' },
                    { id: 3, code: 'DIS', name: 'Disposed', description: 'Sold or thrown away' },
                ]}
            />
        );

      case 'asset-value':
        return (
            <MasterCRUD 
                title="Nilai & Penyusutan"
                description="Manage financial details for assets. (Reflects Assets Table)"
                tableName="assets"
                columns={[
                    { key: 'name', label: 'Asset Name' },
                    { key: 'acquisition_cost', label: 'Acq. Cost', render: (val) => `$${Number(val).toLocaleString()}` },
                    { key: 'depreciation_method', label: 'Method' },
                    { key: 'book_value', label: 'Book Value', render: (val) => <span className="font-bold text-emerald-700">${Number(val || 0).toLocaleString()}</span> },
                ]}
                fields={[
                    { name: 'name', label: 'Asset Name', type: 'text', required: true },
                    { name: 'account_code', label: 'Asset Account Code', type: 'text' },
                    { name: 'acquisition_cost', label: 'Acquisition Cost', type: 'number', required: true },
                    { name: 'residual_value', label: 'Residual Value', type: 'number' },
                    { name: 'depreciation_method', label: 'Depreciation Method', type: 'select', options: ['Straight Line', 'Double Declining', 'Sum of Years'] },
                ]}
                initialData={[
                    { id: 1, name: 'MacBook Pro M2', account_code: '101-200', acquisition_cost: 2500, residual_value: 200, depreciation_method: 'Straight Line', book_value: 1875 },
                    { id: 3, name: 'Toyota Avanza', account_code: '102-100', acquisition_cost: 18000, residual_value: 5000, depreciation_method: 'Double Declining', book_value: 12000 },
                ]}
            />
        );
        
      case 'maintenance-schedule':
        return (
            <MasterCRUD 
                title="Jadwal Maintenance"
                description="Scheduled preventive maintenance tasks."
                tableName="maintenance_schedules"
                columns={[
                    { key: 'asset_id', label: 'Asset ID' },
                    { key: 'maintenance_type_id', label: 'Type ID' },
                    { key: 'next_due_date', label: 'Next Due' },
                    { key: 'interval_type', label: 'Interval' },
                ]}
                fields={[
                    { name: 'asset_id', label: 'Asset ID (UUID)', type: 'text', required: true },
                    { name: 'maintenance_type_id', label: 'Type ID (UUID)', type: 'text', required: true },
                    { name: 'interval_type', label: 'Interval', type: 'select', options: ['Monthly', 'Quarterly', 'Bi-Annual', 'Annual'] },
                    { name: 'last_date', label: 'Last Maintenance', type: 'date' },
                    { name: 'next_due_date', label: 'Next Due Date', type: 'date', required: true },
                    { name: 'assigned_vendor_id', label: 'Vendor ID', type: 'text' }
                ]}
                initialData={[
                    { id: 1, asset_id: '...', maintenance_type_id: '...', interval_type: 'Quarterly', next_due_date: '2023-11-15' },
                ]}
            />
        );

      case 'maintenance-type':
        return (
             <MasterCRUD 
                title="Jenis Maintenance"
                description="Master data for maintenance categories."
                tableName="maintenance_types"
                columns={[
                    { key: 'code', label: 'Code' },
                    { key: 'name', label: 'Type Name' },
                    { key: 'sla_hours', label: 'SLA (Hours)' },
                    { key: 'est_cost', label: 'Est. Cost' },
                ]}
                fields={[
                    { name: 'code', label: 'Code', type: 'text', required: true },
                    { name: 'name', label: 'Name', type: 'text', required: true },
                    { name: 'sla_hours', label: 'SLA (Hours)', type: 'number' },
                    { name: 'est_cost', label: 'Estimated Cost', type: 'number' }
                ]}
                initialData={[
                    { id: 1, code: 'MT-01', name: 'Preventive HVAC', sla_hours: 48, est_cost: 150 },
                    { id: 2, code: 'MT-02', name: 'Corrective IT', sla_hours: 4, est_cost: 0 },
                ]}
            />
        );

      case 'sparepart':
        return (
             <MasterCRUD 
                title="Sparepart Management"
                description="Inventory of parts for maintenance."
                tableName="spareparts"
                columns={[
                    { key: 'name', label: 'Part Name' },
                    { key: 'category', label: 'Category' },
                    { key: 'stock_qty', label: 'Stock', render: (val) => <span className={val < 10 ? 'text-red-500 font-bold' : 'text-gray-900'}>{val}</span> },
                    { key: 'unit', label: 'Unit' },
                ]}
                fields={[
                    { name: 'name', label: 'Part Name', type: 'text', required: true },
                    { name: 'category', label: 'Category', type: 'select', options: ['Electrical', 'Mechanical', 'IT', 'Plumbing'] },
                    { name: 'stock_qty', label: 'Current Stock', type: 'number', required: true },
                    { name: 'min_stock_qty', label: 'Minimum Stock', type: 'number' },
                    { name: 'unit', label: 'Unit (Pcs, Box, etc)', type: 'text' },
                    { name: 'vendor_id', label: 'Vendor ID', type: 'text' }
                ]}
                initialData={[
                    { id: 1, name: 'Fuse 10A', category: 'Electrical', stock_qty: 50, unit: 'Pcs', min_stock_qty: 20 },
                    { id: 2, name: 'Oil Filter', category: 'Mechanical', stock_qty: 5, unit: 'Pcs', min_stock_qty: 10 },
                ]}
            />
        );
      
      case 'disposal':
         return (
             <MasterCRUD 
                title="Disposal & Mutasi"
                description="Logs for asset disposal and location transfers."
                tableName="asset_disposals"
                columns={[
                    { key: 'disposal_date', label: 'Date' },
                    { key: 'disposal_type', label: 'Type', render: (val) => <span className={`px-2 py-0.5 rounded text-xs text-white ${val === 'Sale' ? 'bg-blue-500' : 'bg-red-500'}`}>{val}</span> },
                    { key: 'sale_value', label: 'Value', render: (val) => `$${val}` },
                ]}
                fields={[
                    { name: 'asset_id', label: 'Asset ID', type: 'text', required: true },
                    { name: 'disposal_date', label: 'Date', type: 'date', required: true },
                    { name: 'disposal_type', label: 'Type', type: 'select', options: ['Sale', 'Scrap', 'Donation'], required: true },
                    { name: 'reason', label: 'Reason', type: 'textarea' },
                    { name: 'sale_value', label: 'Sale Value', type: 'number' }
                ]}
                initialData={[
                    { id: 1, disposal_date: '2023-10-01', disposal_type: 'Scrap', reason: 'Broken beyond repair', sale_value: 50 },
                ]}
            />
         );

      case 'asset-docs':
          return (
             <MasterCRUD 
                title="Dokumen Asset"
                description="Manage licenses, manuals, and warranties."
                tableName="asset_documents"
                columns={[
                    { key: 'doc_type', label: 'Type' },
                    { key: 'doc_number', label: 'Doc Number' },
                    { key: 'expiry_date', label: 'Expiry', render: (val) => val || '-' },
                ]}
                fields={[
                    { name: 'asset_id', label: 'Asset ID', type: 'text', required: true },
                    { name: 'doc_type', label: 'Type', type: 'select', options: ['Warranty', 'Insurance', 'Manual', 'License', 'Invoice'] },
                    { name: 'doc_number', label: 'Document Number', type: 'text' },
                    { name: 'issue_date', label: 'Issue Date', type: 'date' },
                    { name: 'expiry_date', label: 'Expiry Date', type: 'date' },
                    { name: 'notes', label: 'Notes', type: 'textarea' }
                ]}
                initialData={[
                    { id: 1, doc_type: 'Insurance', doc_number: 'INS-998877', expiry_date: '2024-05-01' },
                ]}
            />
          );

      case 'asset-role':
        return (
             <MasterCRUD 
                title="Role & PIC Asset (Simulated)"
                description="Access control and approval limits (View Only for now)."
                tableName="users"
                columns={[
                    { key: 'full_name', label: 'User' },
                    { key: 'role', label: 'Role' },
                    { key: 'status', label: 'Status' },
                ]}
                fields={[
                    { name: 'full_name', label: 'User Name', type: 'text', required: true },
                    { name: 'role', label: 'Asset Role', type: 'select', options: ['Admin', 'Viewer', 'Approver', 'Operator'] },
                ]}
                initialData={[
                    { id: 1, full_name: 'John Doe', role: 'Admin', status: 'Active' },
                ]}
            />
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-20">
             <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Settings size={48} className="text-gray-300" />
             </div>
             <h2 className="text-xl font-bold text-gray-600">Coming Soon</h2>
             <p className="text-sm mt-2">The module <span className="font-mono text-gray-900 bg-gray-200 px-1 rounded">{activeView}</span> is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
