// Role-based menu access configuration

export type Role = 'Admin' | 'Viewer' | 'Approver' | 'Operator';

export interface MenuPermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface RolePermissions {
  [menuKey: string]: MenuPermission;
}

// Define menu access for each role
export const rolePermissions: Record<Role, RolePermissions> = {
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

// Helper functions
export const canView = (role: Role, menuKey: string): boolean => {
  return rolePermissions[role]?.[menuKey]?.view ?? false;
};

export const canCreate = (role: Role, menuKey: string): boolean => {
  return rolePermissions[role]?.[menuKey]?.create ?? false;
};

export const canEdit = (role: Role, menuKey: string): boolean => {
  return rolePermissions[role]?.[menuKey]?.edit ?? false;
};

export const canDelete = (role: Role, menuKey: string): boolean => {
  return rolePermissions[role]?.[menuKey]?.delete ?? false;
};

export const getMenuPermission = (role: Role, menuKey: string): MenuPermission => {
  return rolePermissions[role]?.[menuKey] ?? { view: false, create: false, edit: false, delete: false };
};

// Get all accessible menus for a role
export const getAccessibleMenus = (role: Role): string[] => {
  const permissions = rolePermissions[role];
  if (!permissions) return [];
  
  return Object.entries(permissions)
    .filter(([_, perm]) => perm.view)
    .map(([menuKey]) => menuKey);
};

// Menu labels for display
export const menuLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  atk: 'ATK',
  ark: 'ARK',
  timesheet: 'Timesheet',
  'credit-card': 'Credit Card',
  'asset-list': 'Daftar Asset',
  'asset-category': 'Kategori Asset',
  'asset-location': 'Lokasi Asset',
  'asset-status': 'Status Asset',
  vendor: 'Vendor',
  contract: 'Kontrak Asset',
  'asset-value': 'Nilai & Penyusutan',
  'maintenance-schedule': 'Jadwal Maintenance',
  'maintenance-type': 'Jenis Maintenance',
  sparepart: 'Sparepart',
  disposal: 'Disposal & Mutasi',
  'asset-docs': 'Dokumen Asset',
  'asset-role': 'Role & PIC',
  'log-book': 'Log Book',
  'project-management': 'Project Management',
};

// Role descriptions
export const roleDescriptions: Record<Role, string> = {
  Admin: 'Full access to all features and settings',
  Approver: 'Can view all and approve/edit transactions',
  Operator: 'Can create and edit operational data',
  Viewer: 'Read-only access to most features',
};
