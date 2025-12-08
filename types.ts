
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
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  price: number;
  status: 'Active' | 'In Maintenance' | 'Disposed';
  location: string;
}

// ATK Types
export interface ATKItem {
  id: string;
  name: string;
  stock: number;
  unit: string;
  category: string;
  minStock: number;
}

export interface ATKRequest {
  id: string;
  employeeName: string;
  division: string;
  date: string;
  items: { itemId: string; itemName: string; quantity: number }[];
  status: 'Pending' | 'Approved' | 'Rejected';
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
  serviceType: 'Cleaning' | 'Security' | 'IT Support' | 'Supplier';
  contactPerson: string;
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
