import React, { useState } from 'react';
import { Check, X, Save, RotateCcw } from 'lucide-react';
import { menuLabels, roleDescriptions, Role } from '../services/rolePermissions';

interface MenuPermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface RolePermissionsState {
  [role: string]: {
    [menuKey: string]: MenuPermission;
  };
}

const defaultPermissions: RolePermissionsState = {
  Admin: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    atk: { view: true, create: true, edit: true, delete: true },
    ark: { view: true, create: true, edit: true, delete: true },
    timesheet: { view: true, create: true, edit: true, delete: true },
    'credit-card': { view: true, create: true, edit: true, delete: true },
    'asset-list': { view: true, create: true, edit: true, delete: true },
    'asset-category': { view: true, create: true, edit: true, delete: true },
    'asset-location': { view: true, create: true, edit: true, delete: true },
    'asset-status': { view: true, create: true, edit: true, delete: true },
    vendor: { view: true, create: true, edit: true, delete: true },
    contract: { view: true, create: true, edit: true, delete: true },
    'asset-value': { view: true, create: true, edit: true, delete: true },
    'maintenance-schedule': { view: true, create: true, edit: true, delete: true },
    'maintenance-type': { view: true, create: true, edit: true, delete: true },
    sparepart: { view: true, create: true, edit: true, delete: true },
    disposal: { view: true, create: true, edit: true, delete: true },
    'asset-docs': { view: true, create: true, edit: true, delete: true },
    'asset-role': { view: true, create: true, edit: true, delete: true },
    'log-book': { view: true, create: true, edit: true, delete: true },
    'project-management': { view: true, create: true, edit: true, delete: true },
  },
  Approver: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    atk: { view: true, create: false, edit: true, delete: false },
    ark: { view: true, create: false, edit: true, delete: false },
    timesheet: { view: true, create: false, edit: true, delete: false },
    'credit-card': { view: true, create: false, edit: true, delete: false },
    'asset-list': { view: true, create: false, edit: true, delete: false },
    'asset-category': { view: true, create: false, edit: false, delete: false },
    'asset-location': { view: true, create: false, edit: false, delete: false },
    'asset-status': { view: true, create: false, edit: false, delete: false },
    vendor: { view: true, create: false, edit: true, delete: false },
    contract: { view: true, create: false, edit: true, delete: false },
    'asset-value': { view: true, create: false, edit: true, delete: false },
    'maintenance-schedule': { view: true, create: false, edit: true, delete: false },
    'maintenance-type': { view: true, create: false, edit: false, delete: false },
    sparepart: { view: true, create: false, edit: true, delete: false },
    disposal: { view: true, create: false, edit: true, delete: false },
    'asset-docs': { view: true, create: false, edit: true, delete: false },
    'asset-role': { view: false, create: false, edit: false, delete: false },
    'log-book': { view: true, create: false, edit: true, delete: false },
    'project-management': { view: true, create: false, edit: true, delete: false },
  },
  Operator: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    atk: { view: true, create: true, edit: true, delete: false },
    ark: { view: true, create: true, edit: true, delete: false },
    timesheet: { view: true, create: true, edit: true, delete: false },
    'credit-card': { view: false, create: false, edit: false, delete: false },
    'asset-list': { view: true, create: true, edit: true, delete: false },
    'asset-category': { view: true, create: false, edit: false, delete: false },
    'asset-location': { view: true, create: false, edit: false, delete: false },
    'asset-status': { view: true, create: false, edit: false, delete: false },
    vendor: { view: true, create: false, edit: false, delete: false },
    contract: { view: true, create: false, edit: false, delete: false },
    'asset-value': { view: true, create: false, edit: false, delete: false },
    'maintenance-schedule': { view: true, create: true, edit: true, delete: false },
    'maintenance-type': { view: true, create: false, edit: false, delete: false },
    sparepart: { view: true, create: true, edit: true, delete: false },
    disposal: { view: true, create: true, edit: true, delete: false },
    'asset-docs': { view: true, create: true, edit: true, delete: false },
    'asset-role': { view: false, create: false, edit: false, delete: false },
    'log-book': { view: true, create: true, edit: true, delete: false },
    'project-management': { view: true, create: true, edit: true, delete: false },
  },
  Viewer: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    atk: { view: true, create: false, edit: false, delete: false },
    ark: { view: true, create: false, edit: false, delete: false },
    timesheet: { view: true, create: false, edit: false, delete: false },
    'credit-card': { view: false, create: false, edit: false, delete: false },
    'asset-list': { view: true, create: false, edit: false, delete: false },
    'asset-category': { view: true, create: false, edit: false, delete: false },
    'asset-location': { view: true, create: false, edit: false, delete: false },
    'asset-status': { view: true, create: false, edit: false, delete: false },
    vendor: { view: true, create: false, edit: false, delete: false },
    contract: { view: true, create: false, edit: false, delete: false },
    'asset-value': { view: true, create: false, edit: false, delete: false },
    'maintenance-schedule': { view: true, create: false, edit: false, delete: false },
    'maintenance-type': { view: true, create: false, edit: false, delete: false },
    sparepart: { view: true, create: false, edit: false, delete: false },
    disposal: { view: true, create: false, edit: false, delete: false },
    'asset-docs': { view: true, create: false, edit: false, delete: false },
    'asset-role': { view: false, create: false, edit: false, delete: false },
    'log-book': { view: true, create: false, edit: false, delete: false },
    'project-management': { view: true, create: false, edit: false, delete: false },
  },
};

const RolePermissionsMatrix: React.FC = () => {
  const [permissions, setPermissions] = useState<RolePermissionsState>(defaultPermissions);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('Admin');

  const roles: Role[] = ['Admin', 'Approver', 'Operator', 'Viewer'];
  const menuKeys = Object.keys(menuLabels);

  const roleColors: Record<Role, { bg: string; text: string; light: string }> = {
    Admin: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50' },
    Approver: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
    Operator: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' },
    Viewer: { bg: 'bg-gray-500', text: 'text-gray-600', light: 'bg-gray-50' },
  };

  const togglePermission = (role: Role, menuKey: string, permType: 'view' | 'create' | 'edit' | 'delete') => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [menuKey]: {
          ...prev[role][menuKey],
          [permType]: !prev[role][menuKey][permType]
        }
      }
    }));
    setHasChanges(true);
  };

  const toggleAllForMenu = (menuKey: string, permType: 'view' | 'create' | 'edit' | 'delete') => {
    const allEnabled = roles.every(role => permissions[role][menuKey][permType]);
    setPermissions(prev => {
      const newPerms = { ...prev };
      roles.forEach(role => {
        newPerms[role] = {
          ...newPerms[role],
          [menuKey]: {
            ...newPerms[role][menuKey],
            [permType]: !allEnabled
          }
        };
      });
      return newPerms;
    });
    setHasChanges(true);
  };

  const toggleAllForRole = (role: Role, permType: 'view' | 'create' | 'edit' | 'delete') => {
    const allEnabled = menuKeys.every(menuKey => permissions[role][menuKey][permType]);
    setPermissions(prev => ({
      ...prev,
      [role]: Object.fromEntries(
        menuKeys.map(menuKey => [
          menuKey,
          { ...prev[role][menuKey], [permType]: !allEnabled }
        ])
      )
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('rolePermissions', JSON.stringify(permissions));
    setSaving(false);
    setHasChanges(false);
    alert('Permissions saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Reset all permissions to default?')) {
      setPermissions(defaultPermissions);
      setHasChanges(true);
    }
  };

  const PermissionCheckbox: React.FC<{
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
  }> = ({ checked, onChange, disabled }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
        checked 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {checked ? <Check size={14} /> : <X size={14} />}
    </button>
  );

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola akses menu untuk setiap role</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasChanges 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-2 mb-6">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              selectedRole === role
                ? `${roleColors[role].bg} text-white shadow-lg`
                : `${roleColors[role].light} ${roleColors[role].text} hover:opacity-80`
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Role Description */}
      <div className={`${roleColors[selectedRole].light} rounded-xl p-4 mb-6 border border-gray-100`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${roleColors[selectedRole].bg}`}></div>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedRole}</h3>
            <p className="text-sm text-gray-600">{roleDescriptions[selectedRole]}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions untuk {selectedRole}:</p>
        <div className="flex gap-2">
          <button
            onClick={() => toggleAllForRole(selectedRole, 'view')}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Toggle All View
          </button>
          <button
            onClick={() => toggleAllForRole(selectedRole, 'create')}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Toggle All Create
          </button>
          <button
            onClick={() => toggleAllForRole(selectedRole, 'edit')}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Toggle All Edit
          </button>
          <button
            onClick={() => toggleAllForRole(selectedRole, 'delete')}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Toggle All Delete
          </button>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Menu</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">View</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Create</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Edit</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Delete</th>
            </tr>
          </thead>
          <tbody>
            {menuKeys.map((menuKey, index) => {
              const perm = permissions[selectedRole][menuKey];
              return (
                <tr key={menuKey} className={`border-b border-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{menuLabels[menuKey]}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <PermissionCheckbox
                        checked={perm.view}
                        onChange={() => togglePermission(selectedRole, menuKey, 'view')}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <PermissionCheckbox
                        checked={perm.create}
                        onChange={() => togglePermission(selectedRole, menuKey, 'create')}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <PermissionCheckbox
                        checked={perm.edit}
                        onChange={() => togglePermission(selectedRole, menuKey, 'edit')}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <PermissionCheckbox
                        checked={perm.delete}
                        onChange={() => togglePermission(selectedRole, menuKey, 'delete')}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
        <span className="font-medium">Keterangan:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
            <Check size={10} className="text-white" />
          </span>
          Diizinkan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
            <X size={10} className="text-gray-300" />
          </span>
          Tidak Diizinkan
        </span>
      </div>
    </div>
  );
};

export default RolePermissionsMatrix;
