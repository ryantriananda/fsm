
export interface KpiData {
  id: string;
  title: string;
  value: number | string;
  iconName: 'puzzle' | 'car' | 'users' | 'home' | 'gauge' | 'chart' | 'box' | 'dollar' | 'wrench' | 'alert';
  color: string;
  trend?: string;
}

export interface ChartData {
  name: string;
  value: number;
  fill: string;
}

export interface MaintenanceTask {
  id: string;
  asset_name: string;
  task_name: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'High';
  assignee: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  time: string;
  user: string;
  type: 'Mutation' | 'Maintenance' | 'Request' | 'System';
}

export interface DashboardMetrics {
  kpis: KpiData[];
  assetCategories: ChartData[];
  assetStatus: ChartData[];
  upcomingMaintenance: MaintenanceTask[];
  recentActivity: ActivityLog[];
}

// ASSETS Table
export interface Asset {
  id: string;
  asset_code: string;
  name: string;
  category_id?: string;
  location_id?: string;
  vendor_id?: string;
  serial_number: string;
  purchase_date: string;
  acquisition_cost: number;
  residual_value?: number;
  depreciation_method?: string;
  account_code?: string;
  status: 'Active' | 'In Maintenance' | 'Disposed';
  condition?: string;
  
  // UI Helper Fields (Joined)
  category_name?: string;
  location_name?: string;
}

// ATK Types
export interface ATKItem {
  id: string;
  name: string;
  stock_qty: number;
  unit: string;
  category: string;
  min_stock: number;
}

export interface ATKRequest {
  id: string;
  employee_name: string; // Helper
  division: string;      // Helper
  request_date: string;
  items: { itemId: string; itemName: string; quantity: number }[];
  status: 'Pending' | 'Approved' | 'Rejected';
}

// ARK (Aset Ruang Kerja) Types
export interface RoomAsset {
  id: string;
  name: string;
  category: string;
  condition: 'Good' | 'Needs Repair' | 'Broken';
  last_checked: string; // Changed from lastChecked
}

export interface Room {
  id: string;
  name: string;
  type: 'Meeting Room' | 'Office' | 'Common Area' | 'Utility';
  floor: string;
  capacity: number;
  status: 'Available' | 'In Use' | 'Maintenance';
  image?: string;
  assets: RoomAsset[];
}

// Contract Types
export interface Contract {
  id: string;
  title: string;
  party_name: string; // Changed from partyName
  type: 'PKWT' | 'PKWTT' | 'Vendor';
  start_date: string; // Changed from startDate
  end_date: string;   // Changed from endDate
  status: 'Active' | 'Expiring Soon' | 'Expired';
  contract_value?: number; // Changed from value
}

// Timesheet Types
export interface TimesheetEntry {
  id: string;
  employee_name: string; // Helper/Joined
  date: string;
  zone_area: string;     // Changed from project
  activity_task: string; // Changed from task
  hours: number;
  status: 'Submitted' | 'Approved' | 'Rejected';
}

// VENDORS Table
export interface Vendor {
  id: string;
  name: string;
  service_type: 'Cleaning' | 'Security' | 'IT Support' | 'Supplier' | 'Maintenance' | 'Other';
  contact_person: string;
  phone?: string;
  email?: string;
  address?: string;
  rating: number;
  status: 'Active' | 'Inactive';
}

// Credit Card Types
export interface CreditCard {
  id: string;
  holder_name: string;      // Changed from holderName
  bank_name: string;        // Changed from bank
  card_number_last4: string; // Changed from lastFourDigits
  expiry_date: string;      // Changed from expiryDate
  credit_limit: number;     // Changed from limit
  current_balance: number;  // Changed from currentBalance
  status: 'Active' | 'Blocked';
}

// LOG BOOK Table
export interface LogEntry {
  id: string;
  date_time: string;
  asset_name: string;
  activity_type: string;
  user_name: string;
  description: string;
  severity: 'Normal' | 'Medium' | 'Critical';
}

// Project Types
export interface Project {
  id: string;
  name: string;
  manager_name: string; // Helper
  progress_pct: number; // Changed from progress
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  deadline: string;
  team_size: number;    // Changed from teamSize
}

// EMPLOYEES Table
export interface Employee {
  id: string;
  nik: string;
  full_name: string;
  department: string;
  position: string;
  join_date: string;
  status: string;
  email: string;
}

// LEAVE REQUESTS Table
export interface LeaveRequest {
  id: string;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}
