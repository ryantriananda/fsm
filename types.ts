
export interface KpiData {
  id: string;
  title: string;
  value: number;
  iconName: 'puzzle' | 'car' | 'users' | 'home' | 'gauge' | 'chart';
  color: string; // Color key (e.g., 'blue', 'emerald')
}

export interface ChartData {
  name: string;
  value: number;
  fill: string;
}

export interface DashboardMetrics {
  kpis: KpiData[];
  assetCategories: ChartData[];
  maintenanceLogs: ChartData[];
}

export interface Asset {
  id: string;
  assetCode: string; // New unique identifier
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  price: number;
  status: 'Active' | 'In Maintenance' | 'Disposed';
  location: string;
}

// ATK Types
export interface ATKCategory {
  id: number;
  code: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ATKItem {
  id: number;
  code: string;
  name: string;
  category_id: number;
  category_name?: string;
  unit: string;
  unit_price: number;
  stock: number;
  min_stock: number;
  max_stock: number;
  supplier_id?: number;
  supplier_name?: string;
  location?: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ATKStockTransaction {
  id: number;
  item_id: number;
  item_name?: string;
  transaction_type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'OPNAME';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reference_type?: string;
  reference_id?: number;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

export interface ATKRequest {
  id: number;
  request_number: string;
  employee_id?: number;
  employee_name: string;
  department: string;
  request_date: string;
  needed_date?: string;
  purpose?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Partial' | 'Completed' | 'Cancelled';
  approved_by?: string;
  approved_date?: string;
  rejection_reason?: string;
  notes?: string;
  items: ATKRequestItem[];
  created_at?: string;
  updated_at?: string;
}

export interface ATKRequestItem {
  id?: number;
  request_id?: number;
  item_id: number;
  item_name?: string;
  item_code?: string;
  unit?: string;
  quantity_requested: number;
  quantity_approved: number;
  quantity_issued: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Partial' | 'Issued';
  notes?: string;
  available_stock?: number;
}

export interface ATKPurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier_name?: string;
  order_date: string;
  expected_date?: string;
  received_date?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Ordered' | 'Partial' | 'Received' | 'Cancelled';
  total_amount: number;
  approved_by?: string;
  notes?: string;
  items: ATKPurchaseOrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface ATKPurchaseOrderItem {
  id?: number;
  po_id?: number;
  item_id: number;
  item_name?: string;
  item_code?: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_price: number;
  total_price: number;
  status: 'Pending' | 'Partial' | 'Received';
}

export interface ATKStockOpname {
  id: number;
  opname_number: string;
  opname_date: string;
  status: 'Draft' | 'In Progress' | 'Completed' | 'Approved';
  conducted_by?: string;
  approved_by?: string;
  notes?: string;
  items: ATKStockOpnameItem[];
  created_at?: string;
  updated_at?: string;
}

export interface ATKStockOpnameItem {
  id?: number;
  opname_id?: number;
  item_id: number;
  item_name?: string;
  item_code?: string;
  system_stock: number;
  actual_stock: number;
  difference: number;
  notes?: string;
}

// ARK (Aset Ruang Kerja) Types
export interface RoomAsset {
  id: string;
  name: string;
  category: string; // Furniture, Electronics, Decor
  condition: 'Good' | 'Needs Repair' | 'Broken';
  lastChecked: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'Meeting Room' | 'Office' | 'Common Area' | 'Utility';
  floor: string;
  capacity: number;
  status: 'Available' | 'In Use' | 'Maintenance';
  image?: string; // Optional placeholder for UI
  assets: RoomAsset[];
}

// Contract Types
export interface Contract {
  id: string;
  title: string;
  partyName: string; // Employee or Vendor Name
  type: 'PKWT' | 'PKWTT' | 'Vendor';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  value?: number;
}

// Timesheet Types
export interface TimesheetEntry {
  id: string;
  employeeName: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  status: 'Submitted' | 'Approved' | 'Rejected';
}

// Vendor Types
export interface Vendor {
  id: string;
  name: string;
  serviceType: 'Cleaning' | 'Security' | 'IT Support' | 'Supplier' | 'Maintenance' | 'Other';
  contactPerson: string;
  phone?: string;
  email?: string;
  address?: string;
  rating: number; // 1-5
  status: 'Active' | 'Inactive';
}

// Credit Card Types
export interface CreditCard {
  id: string;
  holderName: string;
  bank: string;
  lastFourDigits: string;
  expiryDate: string;
  limit: number;
  currentBalance: number;
  status: 'Active' | 'Blocked';
}

// Log Book Types
export interface LogEntry {
  id: string;
  date: string;
  assetName: string;
  activity: string; // Maintenance, Incident, Check-out
  user: string;
  notes: string;
  severity: 'Normal' | 'Medium' | 'Critical';
}

// Project Types
export interface Project {
  id: string;
  name: string;
  manager: string;
  progress: number; // 0-100
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  deadline: string;
  teamSize: number;
}

// Employee Types
export interface Employee {
  id: string;
  nik: string;
  name: string;
  department: string;
  position: string;
  joinDate: string;
  status: string; // 'Active' | 'On Leave' etc
  email: string;
}

// Leave Types
export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string; // 'Annual' | 'Sick' etc
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}
