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
import MasterCRUD from './components/MasterCRUD';
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
                    { key: 'depreciation', label: 'Depreciation' },
                    { key: 'life', label: 'Default Life' },
                ]}
                fields={[
                    { name: 'code', label: 'Category Code', type: 'text', required: true },
                    { name: 'name', label: 'Category Name', type: 'text', required: true },
                    { name: 'type', label: 'Type', type: 'select', options: ['Fix', 'Moveable'] },
                    { name: 'depreciation', label: 'Depreciation?', type: 'select', options: ['Yes', 'No'] },
                    { name: 'life', label: 'Useful Life (Years)', type: 'number' }
                ]}
                initialData={[
                    { id: 1, code: 'CAT-001', name: 'Electronics', type: 'Moveable', depreciation: 'Yes', life: 4 },
                    { id: 2, code: 'CAT-002', name: 'Furniture', type: 'Fix', depreciation: 'Yes', life: 8 },
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
                    { key: 'room', label: 'Room' },
                    { key: 'pic', label: 'PIC' },
                ]}
                fields={[
                    { name: 'code', label: 'Location Code', type: 'text', required: true },
                    { name: 'building', label: 'Building Name', type: 'text' },
                    { name: 'floor', label: 'Floor', type: 'text' },
                    { name: 'room', label: 'Room Name', type: 'text', required: true },
                    { name: 'pic', label: 'Person In Charge', type: 'text' }
                ]}
                initialData={[
                    { id: 1, code: 'HQ-L2-01', building: 'Headquarters', floor: '2nd Floor', room: 'Server Room', pic: 'IT Admin' },
                    { id: 2, code: 'HQ-L1-05', building: 'Headquarters', floor: '1st Floor', room: 'Lobby', pic: 'Receptionist' },
                ]}
            />
        );

      case 'asset-status':
        return (
            <MasterCRUD 
                title="Status Asset"
                description="Define asset lifecycles and reporting statuses."
                tableName="asset_statuses"
                columns={[
                    { key: 'code', label: 'Code' },
                    { key: 'name', label: 'Status Name', render: (val) => <span className="font-semibold text-gray-800">{val}</span> },
                    { key: 'isActive', label: 'Active Asset?', render: (val) => val === 'Yes' ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-500">No</span> },
                ]}
                fields={[
                    { name: 'code', label: 'Status Code', type: 'text', required: true },
                    { name: 'name', label: 'Status Name', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'isActive', label: 'Considered Active?', type: 'select', options: ['Yes', 'No'] }
                ]}
                initialData={[
                    { id: 1, code: 'ACT', name: 'Active', description: 'Asset is in use', isActive: 'Yes' },
                    { id: 2, code: 'MNT', name: 'In Maintenance', description: 'Undergoing repair', isActive: 'No' },
                    { id: 3, code: 'DIS', name: 'Disposed', description: 'Sold or thrown away', isActive: 'No' },
                ]}
            />
        );

      case 'asset-value':
        return (
            <MasterCRUD 
                title="Nilai & Penyusutan"
                description="Manage financial details for assets."
                tableName="asset_valuations"
                columns={[
                    { key: 'assetName', label: 'Asset Name' },
                    { key: 'acquisitionCost', label: 'Acq. Cost', render: (val) => `$${Number(val).toLocaleString()}` },
                    { key: 'method', label: 'Method' },
                    { key: 'bookValue', label: 'Book Value', render: (val) => <span className="font-bold text-emerald-700">${Number(val).toLocaleString()}</span> },
                ]}
                fields={[
                    { name: 'assetName', label: 'Asset Name', type: 'text', required: true },
                    { name: 'account', label: 'Asset Account Code', type: 'text' },
                    { name: 'acquisitionCost', label: 'Acquisition Cost', type: 'number', required: true },
                    { name: 'residualValue', label: 'Residual Value', type: 'number' },
                    { name: 'method', label: 'Depreciation Method', type: 'select', options: ['Straight Line', 'Double Declining', 'Sum of Years'] },
                    { name: 'usefulLife', label: 'Useful Life (Years)', type: 'number' },
                    { name: 'bookValue', label: 'Current Book Value', type: 'number' }
                ]}
                initialData={[
                    { id: 1, assetName: 'MacBook Pro M2', account: '101-200', acquisitionCost: 2500, residualValue: 200, method: 'Straight Line', usefulLife: 4, bookValue: 1875 },
                    { id: 3, assetName: 'Toyota Avanza', account: '102-100', acquisitionCost: 18000, residualValue: 5000, method: 'Double Declining', usefulLife: 5, bookValue: 12000 },
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
                    { key: 'asset', label: 'Asset' },
                    { key: 'type', label: 'Maintenance Type' },
                    { key: 'nextDate', label: 'Next Due' },
                    { key: 'vendor', label: 'Vendor' },
                ]}
                fields={[
                    { name: 'asset', label: 'Asset Name', type: 'text', required: true },
                    { name: 'type', label: 'Maintenance Type', type: 'select', options: ['HVAC Service', 'Car Service', 'IT Clean', 'Calibration'] },
                    { name: 'interval', label: 'Interval', type: 'select', options: ['Monthly', 'Quarterly', 'Bi-Annual', 'Annual'] },
                    { name: 'lastDate', label: 'Last Maintenance', type: 'date' },
                    { name: 'nextDate', label: 'Next Due Date', type: 'date', required: true },
                    { name: 'vendor', label: 'Assigned Vendor', type: 'text' }
                ]}
                initialData={[
                    { id: 1, asset: 'Server Room A', type: 'HVAC Service', interval: 'Quarterly', nextDate: '2023-11-15', vendor: 'CoolAir Inc' },
                    { id: 2, asset: 'Toyota Avanza', type: 'Car Service', interval: 'Bi-Annual', nextDate: '2023-12-01', vendor: 'Auto2000' },
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
                    { key: 'sla', label: 'SLA (Hours)' },
                    { key: 'estCost', label: 'Est. Cost' },
                ]}
                fields={[
                    { name: 'code', label: 'Code', type: 'text', required: true },
                    { name: 'name', label: 'Name', type: 'text', required: true },
                    { name: 'sla', label: 'SLA (Hours)', type: 'number' },
                    { name: 'estCost', label: 'Estimated Cost', type: 'number' }
                ]}
                initialData={[
                    { id: 1, code: 'MT-01', name: 'Preventive HVAC', sla: 48, estCost: 150 },
                    { id: 2, code: 'MT-02', name: 'Corrective IT', sla: 4, estCost: 0 },
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
                    { key: 'stock', label: 'Stock', render: (val) => <span className={val < 10 ? 'text-red-500 font-bold' : 'text-gray-900'}>{val}</span> },
                    { key: 'unit', label: 'Unit' },
                ]}
                fields={[
                    { name: 'name', label: 'Part Name', type: 'text', required: true },
                    { name: 'category', label: 'Category', type: 'select', options: ['Electrical', 'Mechanical', 'IT', 'Plumbing'] },
                    { name: 'stock', label: 'Current Stock', type: 'number', required: true },
                    { name: 'minStock', label: 'Minimum Stock', type: 'number' },
                    { name: 'unit', label: 'Unit (Pcs, Box, etc)', type: 'text' },
                    { name: 'vendor', label: 'Supplier', type: 'text' }
                ]}
                initialData={[
                    { id: 1, name: 'Fuse 10A', category: 'Electrical', stock: 50, unit: 'Pcs', minStock: 20 },
                    { id: 2, name: 'Oil Filter', category: 'Mechanical', stock: 5, unit: 'Pcs', minStock: 10 },
                ]}
            />
        );
      
      case 'disposal':
         return (
             <MasterCRUD 
                title="Disposal & Mutasi"
                description="Logs for asset disposal and location transfers."
                tableName="disposals"
                columns={[
                    { key: 'date', label: 'Date' },
                    { key: 'type', label: 'Type', render: (val) => <span className={`px-2 py-0.5 rounded text-xs text-white ${val === 'Disposal' ? 'bg-red-500' : 'bg-blue-500'}`}>{val}</span> },
                    { key: 'asset', label: 'Asset' },
                    { key: 'details', label: 'Details' },
                ]}
                fields={[
                    { name: 'date', label: 'Date', type: 'date', required: true },
                    { name: 'type', label: 'Transaction Type', type: 'select', options: ['Disposal', 'Mutation'], required: true },
                    { name: 'asset', label: 'Asset Name', type: 'text', required: true },
                    { name: 'details', label: 'Details / Reason / New Location', type: 'textarea' },
                    { name: 'value', label: 'Sale Value (if Disposal)', type: 'number' }
                ]}
                initialData={[
                    { id: 1, date: '2023-10-01', type: 'Disposal', asset: 'Old Printer', details: 'Broken beyond repair, Sold for scrap', value: 50 },
                    { id: 2, date: '2023-10-15', type: 'Mutation', asset: 'Office Chair', details: 'Moved from L1 to L2', value: 0 },
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
                    { key: 'asset', label: 'Asset' },
                    { key: 'docType', label: 'Document Type' },
                    { key: 'docNo', label: 'Doc Number' },
                    { key: 'expiry', label: 'Expiry Date', render: (val) => val || '-' },
                ]}
                fields={[
                    { name: 'asset', label: 'Asset Name', type: 'text', required: true },
                    { name: 'docType', label: 'Document Type', type: 'select', options: ['Warranty', 'Insurance', 'Manual', 'License', 'Invoice'] },
                    { name: 'docNo', label: 'Document Number', type: 'text' },
                    { name: 'issueDate', label: 'Issue Date', type: 'date' },
                    { name: 'expiry', label: 'Expiry Date', type: 'date' },
                    { name: 'notes', label: 'Notes', type: 'textarea' }
                ]}
                initialData={[
                    { id: 1, asset: 'Toyota Avanza', docType: 'Insurance', docNo: 'INS-998877', expiry: '2024-05-01' },
                    { id: 2, asset: 'MacBook Pro', docType: 'Warranty', docNo: 'WAR-APPLE-01', expiry: '2024-01-15' },
                ]}
            />
          );

      case 'asset-role':
        return (
             <MasterCRUD 
                title="Role & PIC Asset"
                description="Access control and approval limits for asset management."
                tableName="asset_roles"
                columns={[
                    { key: 'user', label: 'User' },
                    { key: 'dept', label: 'Department' },
                    { key: 'role', label: 'Role' },
                    { key: 'limit', label: 'Approval Limit', render: (val) => `$${Number(val).toLocaleString()}` },
                ]}
                fields={[
                    { name: 'user', label: 'User Name', type: 'text', required: true },
                    { name: 'dept', label: 'Department', type: 'select', options: ['IT', 'HR', 'GA', 'Finance', 'Ops'] },
                    { name: 'role', label: 'Asset Role', type: 'select', options: ['Admin', 'Viewer', 'Approver', 'Operator'] },
                    { name: 'limit', label: 'Approval Limit ($)', type: 'number' },
                    { name: 'access', label: 'Menu Access', type: 'text' }
                ]}
                initialData={[
                    { id: 1, user: 'John Doe', dept: 'IT', role: 'Admin', limit: 10000, access: 'All' },
                    { id: 2, user: 'Jane Smith', dept: 'GA', role: 'Operator', limit: 500, access: 'Maintenance' },
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