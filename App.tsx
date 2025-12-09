import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MasterAsset from './components/MasterAsset';
import ATK from './components/ATK';
import ARK from './components/ARK';
import ContractComponent from './components/Contract';
import Timesheet from './components/Timesheet';
import Vendor from './components/Vendor';
import CreditCard from './components/CreditCard';
import LogBook from './components/LogBook';
import ProjectManagement from './components/ProjectManagement';
import MasterCRUD from './components/MasterCRUD';
import { Settings } from 'lucide-react';
import { assetCategoryAPI, assetLocationAPI, assetStatusAPI, assetAPI, vendorAPI, contractAPI, maintenanceScheduleAPI, maintenanceTypeAPI, disposalAPI, assetDocumentAPI, sparepartAPI, assetRoleAPI } from './services/apiService';

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
      case 'contract': return <ContractComponent />;
      
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
                apiService={assetCategoryAPI}
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
                apiService={assetLocationAPI}
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
                    { key: 'is_active', label: 'Active Asset?', render: (val) => val === 'Yes' ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-500">No</span> },
                ]}
                fields={[
                    { name: 'code', label: 'Status Code', type: 'text', required: true },
                    { name: 'name', label: 'Status Name', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'is_active', label: 'Considered Active?', type: 'select', options: ['Yes', 'No'] }
                ]}
                apiService={assetStatusAPI}
            />
        );

      case 'asset-value':
        return (
            <MasterCRUD 
                title="Nilai & Penyusutan"
                description="Manage financial details for assets."
                tableName="assets"
                columns={[
                    { key: 'name', label: 'Asset Name' },
                    { key: 'acquisition_cost', label: 'Acq. Cost', render: (val) => `${Number(val).toLocaleString()}` },
                    { key: 'depreciation_method', label: 'Method' },
                    { key: 'book_value', label: 'Book Value', render: (val) => <span className="font-bold text-emerald-700">${Number(val).toLocaleString()}</span> },
                ]}
                fields={[
                    { name: 'name', label: 'Asset Name', type: 'text', required: true },
                    { name: 'code', label: 'Asset Code', type: 'text', required: true },
                    { name: 'acquisition_cost', label: 'Acquisition Cost', type: 'number', required: true },
                    { name: 'residual_value', label: 'Residual Value', type: 'number' },
                    { name: 'depreciation_method', label: 'Depreciation Method', type: 'select', options: ['Straight Line', 'Double Declining', 'Sum of Years'] },
                    { name: 'useful_life', label: 'Useful Life (Years)', type: 'number' },
                    { name: 'book_value', label: 'Current Book Value', type: 'number' }
                ]}
                apiService={assetAPI}
            />
        );
        
      case 'maintenance-schedule':
        return (
            <MasterCRUD 
                title="Jadwal Maintenance"
                description="Scheduled preventive maintenance tasks."
                tableName="maintenance_schedules"
                columns={[
                    { key: 'asset_id', label: 'Asset' },
                    { key: 'maintenance_type_id', label: 'Maintenance Type' },
                    { key: 'next_date', label: 'Next Due' },
                    { key: 'vendor_id', label: 'Vendor' },
                ]}
                fields={[
                    { name: 'asset_id', label: 'Asset ID', type: 'number', required: true },
                    { name: 'maintenance_type_id', label: 'Maintenance Type ID', type: 'number', required: true },
                    { name: 'interval', label: 'Interval', type: 'select', options: ['Monthly', 'Quarterly', 'Bi-Annual', 'Annual'] },
                    { name: 'last_date', label: 'Last Maintenance', type: 'date' },
                    { name: 'next_date', label: 'Next Due Date', type: 'date', required: true },
                    { name: 'vendor_id', label: 'Vendor ID', type: 'number' }
                ]}
                apiService={maintenanceScheduleAPI}
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
                    { key: 'est_cost', label: 'Est. Cost' },
                ]}
                fields={[
                    { name: 'code', label: 'Code', type: 'text', required: true },
                    { name: 'name', label: 'Name', type: 'text', required: true },
                    { name: 'sla', label: 'SLA (Hours)', type: 'number' },
                    { name: 'est_cost', label: 'Estimated Cost', type: 'number' }
                ]}
                apiService={maintenanceTypeAPI}
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
                    { name: 'code', label: 'Part Code', type: 'text', required: true },
                    { name: 'name', label: 'Part Name', type: 'text', required: true },
                    { name: 'category', label: 'Category', type: 'select', options: ['Electrical', 'Mechanical', 'IT', 'Plumbing'] },
                    { name: 'stock', label: 'Current Stock', type: 'number', required: true },
                    { name: 'min_stock', label: 'Minimum Stock', type: 'number' },
                    { name: 'unit', label: 'Unit (Pcs, Box, etc)', type: 'text' },
                    { name: 'asset_id', label: 'Asset ID', type: 'number' },
                    { name: 'vendor_id', label: 'Supplier ID', type: 'number' }
                ]}
                apiService={sparepartAPI}
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
                    { key: 'asset_id', label: 'Asset' },
                    { key: 'details', label: 'Details' },
                ]}
                fields={[
                    { name: 'date', label: 'Date', type: 'date', required: true },
                    { name: 'type', label: 'Transaction Type', type: 'select', options: ['Disposal', 'Mutation'], required: true },
                    { name: 'asset_id', label: 'Asset ID', type: 'number', required: true },
                    { name: 'details', label: 'Details / Reason / New Location', type: 'textarea' },
                    { name: 'value', label: 'Sale Value (if Disposal)', type: 'number' }
                ]}
                apiService={disposalAPI}
            />
         );

      case 'asset-docs':
          return (
             <MasterCRUD 
                title="Dokumen Asset"
                description="Manage licenses, manuals, and warranties."
                tableName="asset_documents"
                columns={[
                    { key: 'asset_id', label: 'Asset' },
                    { key: 'doc_type', label: 'Document Type' },
                    { key: 'doc_number', label: 'Doc Number' },
                    { key: 'expiry_date', label: 'Expiry Date', render: (val) => val || '-' },
                ]}
                fields={[
                    { name: 'asset_id', label: 'Asset ID', type: 'number', required: true },
                    { name: 'doc_type', label: 'Document Type', type: 'select', options: ['Warranty', 'Insurance', 'Manual', 'License', 'Invoice'] },
                    { name: 'doc_number', label: 'Document Number', type: 'text' },
                    { name: 'issue_date', label: 'Issue Date', type: 'date' },
                    { name: 'expiry_date', label: 'Expiry Date', type: 'date' },
                    { name: 'notes', label: 'Notes', type: 'textarea' }
                ]}
                apiService={assetDocumentAPI}
            />
          );

      case 'asset-role':
        return (
             <MasterCRUD 
                title="Role & PIC Asset"
                description="Access control and approval limits for asset management."
                tableName="asset_roles"
                columns={[
                    { key: 'user_name', label: 'User' },
                    { key: 'department', label: 'Department' },
                    { key: 'role', label: 'Role' },
                    { key: 'approval_limit', label: 'Approval Limit', render: (val) => `Rp ${Number(val).toLocaleString()}` },
                ]}
                fields={[
                    { name: 'user_name', label: 'User Name', type: 'text', required: true },
                    { name: 'department', label: 'Department', type: 'select', options: ['IT', 'HR', 'GA', 'Finance', 'Ops'] },
                    { name: 'role', label: 'Asset Role', type: 'select', options: ['Admin', 'Viewer', 'Approver', 'Operator'] },
                    { name: 'approval_limit', label: 'Approval Limit (Rp)', type: 'number' },
                    { name: 'menu_access', label: 'Menu Access', type: 'text' }
                ]}
                apiService={assetRoleAPI}
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
