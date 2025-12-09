import React from 'react';
import { Check, X } from 'lucide-react';
import { rolePermissions, menuLabels, roleDescriptions, Role } from '../services/rolePermissions';

const RolePermissionsMatrix: React.FC = () => {
  const roles: Role[] = ['Admin', 'Approver', 'Operator', 'Viewer'];
  const menuKeys = Object.keys(menuLabels);

  const roleColors: Record<Role, string> = {
    Admin: 'bg-red-500',
    Approver: 'bg-blue-500',
    Operator: 'bg-green-500',
    Viewer: 'bg-gray-500',
  };

  return (
    <div className="p-6 bg-white min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Role Permissions Matrix</h1>
        <p className="text-sm text-gray-500 mt-1">Menu access configuration for each role</p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {roles.map(role => (
          <div key={role} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${roleColors[role]}`}></div>
              <h3 className="font-bold text-gray-900">{role}</h3>
            </div>
            <p className="text-xs text-gray-500">{roleDescriptions[role]}</p>
          </div>
        ))}
      </div>

      {/* Permissions Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50">
                Menu
              </th>
              {roles.map(role => (
                <th key={role} colSpan={4} className="px-2 py-3 text-center text-sm font-semibold text-gray-900 border-l border-gray-200">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${roleColors[role]}`}></div>
                    {role}
                  </div>
                </th>
              ))}
            </tr>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 text-left text-xs text-gray-500 sticky left-0 bg-gray-50"></th>
              {roles.map(role => (
                <React.Fragment key={role}>
                  <th className="px-1 py-2 text-center text-xs text-gray-500 border-l border-gray-200">V</th>
                  <th className="px-1 py-2 text-center text-xs text-gray-500">C</th>
                  <th className="px-1 py-2 text-center text-xs text-gray-500">E</th>
                  <th className="px-1 py-2 text-center text-xs text-gray-500">D</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {menuKeys.map((menuKey, index) => (
              <tr key={menuKey} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 text-sm text-gray-900 font-medium sticky left-0 bg-inherit border-r border-gray-100">
                  {menuLabels[menuKey]}
                </td>
                {roles.map(role => {
                  const perm = rolePermissions[role][menuKey];
                  return (
                    <React.Fragment key={`${role}-${menuKey}`}>
                      <td className="px-1 py-2 text-center border-l border-gray-100">
                        {perm?.view ? <Check size={14} className="mx-auto text-green-600" /> : <X size={14} className="mx-auto text-gray-300" />}
                      </td>
                      <td className="px-1 py-2 text-center">
                        {perm?.create ? <Check size={14} className="mx-auto text-green-600" /> : <X size={14} className="mx-auto text-gray-300" />}
                      </td>
                      <td className="px-1 py-2 text-center">
                        {perm?.edit ? <Check size={14} className="mx-auto text-green-600" /> : <X size={14} className="mx-auto text-gray-300" />}
                      </td>
                      <td className="px-1 py-2 text-center">
                        {perm?.delete ? <Check size={14} className="mx-auto text-green-600" /> : <X size={14} className="mx-auto text-gray-300" />}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
        <span className="font-medium">Legend:</span>
        <span>V = View</span>
        <span>C = Create</span>
        <span>E = Edit</span>
        <span>D = Delete</span>
        <span className="flex items-center gap-1"><Check size={12} className="text-green-600" /> Allowed</span>
        <span className="flex items-center gap-1"><X size={12} className="text-gray-300" /> Not Allowed</span>
      </div>
    </div>
  );
};

export default RolePermissionsMatrix;
