import { supabase } from './supabase';

// Generic CRUD helper
const createCRUD = <T extends { id?: number }>(tableName: string) => ({
  async getAll(): Promise<T[]> {
    const { data, error } = await supabase.from(tableName).select('*').order('id');
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<T | null> {
    const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async create(item: Partial<T>): Promise<T> {
    const { data, error } = await supabase.from(tableName).insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: number, item: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(tableName)
      .update({ ...item, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) throw error;
  }
});

// =====================================================
// VENDORS
// =====================================================
export const vendorService = {
  ...createCRUD<any>('vendors'),
  
  async getActive() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('status', 'Active')
      .order('name');
    if (error) throw error;
    return data || [];
  }
};


// =====================================================
// ASSET MANAGEMENT
// =====================================================
export const assetCategoryService = {
  ...createCRUD<any>('asset_categories')
};

export const assetLocationService = {
  ...createCRUD<any>('asset_locations')
};

export const assetStatusService = {
  ...createCRUD<any>('asset_statuses'),
  
  async getActive() {
    const { data, error } = await supabase
      .from('asset_statuses')
      .select('*')
      .eq('is_active', 'Yes')
      .order('name');
    if (error) throw error;
    return data || [];
  }
};

export const assetService = {
  ...createCRUD<any>('assets'),
  
  async getAllWithRelations() {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        asset_categories(name),
        asset_locations(building, room),
        asset_statuses(name),
        vendors(name)
      `)
      .order('name');
    if (error) throw error;
    return (data || []).map(a => ({
      ...a,
      category_name: a.asset_categories?.name,
      location_name: a.asset_locations ? `${a.asset_locations.building} - ${a.asset_locations.room}` : '',
      status_name: a.asset_statuses?.name,
      vendor_name: a.vendors?.name
    }));
  }
};

export const maintenanceTypeService = {
  ...createCRUD<any>('maintenance_types')
};

export const maintenanceScheduleService = {
  ...createCRUD<any>('maintenance_schedules'),
  
  async getAllWithRelations() {
    const { data, error } = await supabase
      .from('maintenance_schedules')
      .select(`
        *,
        assets(name, code),
        maintenance_types(name),
        vendors(name)
      `)
      .order('next_date');
    if (error) throw error;
    return (data || []).map(m => ({
      ...m,
      asset_name: m.assets?.name,
      asset_code: m.assets?.code,
      type_name: m.maintenance_types?.name,
      vendor_name: m.vendors?.name
    }));
  }
};

export const disposalService = {
  ...createCRUD<any>('disposals'),
  
  async getAllWithRelations() {
    const { data, error } = await supabase
      .from('disposals')
      .select(`*, assets(name, code)`)
      .order('date', { ascending: false });
    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      asset_name: d.assets?.name,
      asset_code: d.assets?.code
    }));
  }
};

export const assetDocumentService = {
  ...createCRUD<any>('asset_documents'),
  
  async getByAsset(assetId: number) {
    const { data, error } = await supabase
      .from('asset_documents')
      .select('*')
      .eq('asset_id', assetId)
      .order('issue_date', { ascending: false });
    if (error) throw error;
    return data || [];
  }
};

export const sparepartService = {
  ...createCRUD<any>('spareparts'),
  
  async getAllWithRelations() {
    const { data, error } = await supabase
      .from('spareparts')
      .select(`*, assets(name), vendors(name)`)
      .order('name');
    if (error) throw error;
    return (data || []).map(s => ({
      ...s,
      asset_name: s.assets?.name,
      vendor_name: s.vendors?.name
    }));
  },
  
  async getLowStock() {
    const { data, error } = await supabase
      .from('spareparts')
      .select('*')
      .filter('stock', 'lte', 'min_stock');
    if (error) throw error;
    return data || [];
  }
};


// =====================================================
// CONTRACTS
// =====================================================
export const contractService = {
  ...createCRUD<any>('contracts'),
  
  async getAllWithRelations() {
    const { data, error } = await supabase
      .from('contracts')
      .select(`*, assets(name), vendors(name)`)
      .order('end_date');
    if (error) throw error;
    return (data || []).map(c => ({
      ...c,
      asset_name: c.assets?.name,
      vendor_name: c.vendors?.name
    }));
  },
  
  async getExpiringSoon(days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('status', 'Active')
      .lte('end_date', futureDate.toISOString().split('T')[0])
      .order('end_date');
    if (error) throw error;
    return data || [];
  }
};

// =====================================================
// ARK (Alat Rumah Tangga Kantor)
// =====================================================
export const arkService = {
  ...createCRUD<any>('ark_items'),
  
  async getAllWithRelations() {
    const { data, error } = await supabase
      .from('ark_items')
      .select(`*, asset_locations(building, room), assets(name)`)
      .order('name');
    if (error) throw error;
    return (data || []).map(a => ({
      ...a,
      location_name: a.asset_locations ? `${a.asset_locations.building} - ${a.asset_locations.room}` : '',
      asset_name: a.assets?.name
    }));
  }
};

// =====================================================
// EMPLOYEES
// =====================================================
export const employeeService = {
  ...createCRUD<any>('employees'),
  
  async getActive() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('status', 'Active')
      .order('name');
    if (error) throw error;
    return data || [];
  },
  
  async getByDepartment(department: string) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('department', department)
      .order('name');
    if (error) throw error;
    return data || [];
  }
};

// =====================================================
// LEAVE MANAGEMENT
// =====================================================
export const leaveService = {
  ...createCRUD<any>('leave_requests'),
  
  async getAllWithEmployee() {
    const { data, error } = await supabase
      .from('leave_requests')
      .select(`*, employees(name, department)`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  
  async getPending() {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('status', 'Pending')
      .order('start_date');
    if (error) throw error;
    return data || [];
  },
  
  async approve(id: number, approvedBy: string) {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: 'Approved', approved_by: approvedBy, approved_date: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
  
  async reject(id: number, approvedBy: string, reason?: string) {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: 'Rejected', approved_by: approvedBy, approved_date: new Date().toISOString(), notes: reason })
      .eq('id', id);
    if (error) throw error;
  }
};


// =====================================================
// TIMESHEET
// =====================================================
export const timesheetService = {
  ...createCRUD<any>('timesheets'),
  
  async getByEmployee(employeeId: number) {
    const { data, error } = await supabase
      .from('timesheets')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  
  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('timesheets')
      .select(`*, employees(name, department)`)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
    if (error) throw error;
    return data || [];
  },
  
  async approve(id: number, approvedBy: string) {
    const { error } = await supabase
      .from('timesheets')
      .update({ status: 'Approved', approved_by: approvedBy })
      .eq('id', id);
    if (error) throw error;
  }
};

// =====================================================
// CREDIT CARDS
// =====================================================
export const creditCardService = {
  ...createCRUD<any>('credit_cards'),
  
  async getActive() {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('status', 'Active')
      .order('holder_name');
    if (error) throw error;
    return data || [];
  }
};

export const creditCardTransactionService = {
  ...createCRUD<any>('credit_card_transactions'),
  
  async getByCard(cardId: number) {
    const { data, error } = await supabase
      .from('credit_card_transactions')
      .select('*')
      .eq('card_id', cardId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  }
};

// =====================================================
// LOG BOOK
// =====================================================
export const logBookService = {
  ...createCRUD<any>('log_books'),
  
  async getAllWithAsset() {
    const { data, error } = await supabase
      .from('log_books')
      .select(`*, assets(name, code)`)
      .order('date', { ascending: false });
    if (error) throw error;
    return (data || []).map(l => ({
      ...l,
      asset_name: l.assets?.name,
      asset_code: l.assets?.code
    }));
  },
  
  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('log_books')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  }
};

// =====================================================
// PROJECTS
// =====================================================
export const projectService = {
  ...createCRUD<any>('projects'),
  
  async getActive() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .neq('status', 'Completed')
      .order('deadline');
    if (error) throw error;
    return data || [];
  },
  
  async updateProgress(id: number, progress: number) {
    const status = progress >= 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Planning';
    const { error } = await supabase
      .from('projects')
      .update({ progress, status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }
};

export const projectTaskService = {
  ...createCRUD<any>('project_tasks'),
  
  async getByProject(projectId: number) {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date');
    if (error) throw error;
    return data || [];
  }
};

// =====================================================
// ROLES & PERMISSIONS
// =====================================================
export const roleService = {
  ...createCRUD<any>('roles')
};

export const permissionService = {
  ...createCRUD<any>('permissions')
};

export const rolePermissionService = {
  async getByRole(roleId: number) {
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`*, permissions(module, action)`)
      .eq('role_id', roleId);
    if (error) throw error;
    return data || [];
  },
  
  async setPermission(roleId: number, permissionId: number, granted: boolean) {
    const { data: existing } = await supabase
      .from('role_permissions')
      .select('id')
      .eq('role_id', roleId)
      .eq('permission_id', permissionId)
      .single();
    
    if (existing) {
      const { error } = await supabase
        .from('role_permissions')
        .update({ granted })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('role_permissions')
        .insert([{ role_id: roleId, permission_id: permissionId, granted }]);
      if (error) throw error;
    }
  }
};

export const assetRoleService = {
  ...createCRUD<any>('asset_roles')
};


// =====================================================
// DASHBOARD STATS
// =====================================================
export const dashboardService = {
  async getStats() {
    const [
      { count: totalAssets },
      { count: activeAssets },
      { count: pendingMaintenance },
      { count: totalEmployees },
      { count: pendingLeaves },
      { count: activeProjects },
      { count: lowStockATK },
      { count: expiringContracts }
    ] = await Promise.all([
      supabase.from('assets').select('*', { count: 'exact', head: true }),
      supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status_id', 1),
      supabase.from('maintenance_schedules').select('*', { count: 'exact', head: true }).eq('status', 'Scheduled'),
      supabase.from('employees').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
      supabase.from('leave_requests').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).neq('status', 'Completed'),
      supabase.from('atk_items').select('*', { count: 'exact', head: true }).lte('stock', 10),
      supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('status', 'Active')
    ]);

    return {
      totalAssets: totalAssets || 0,
      activeAssets: activeAssets || 0,
      pendingMaintenance: pendingMaintenance || 0,
      totalEmployees: totalEmployees || 0,
      pendingLeaves: pendingLeaves || 0,
      activeProjects: activeProjects || 0,
      lowStockATK: lowStockATK || 0,
      expiringContracts: expiringContracts || 0
    };
  },

  async getRecentActivities(limit: number = 10) {
    const { data, error } = await supabase
      .from('log_books')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async getAssetsByCategory() {
    const { data, error } = await supabase
      .from('assets')
      .select('category_id, asset_categories(name)');
    if (error) throw error;
    
    const counts: Record<string, number> = {};
    (data || []).forEach(a => {
      const name = a.asset_categories?.name || 'Uncategorized';
      counts[name] = (counts[name] || 0) + 1;
    });
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  },

  async getMaintenanceByMonth() {
    const { data, error } = await supabase
      .from('maintenance_schedules')
      .select('next_date')
      .gte('next_date', new Date().toISOString().split('T')[0]);
    if (error) throw error;
    
    const counts: Record<string, number> = {};
    (data || []).forEach(m => {
      if (m.next_date) {
        const month = new Date(m.next_date).toLocaleString('default', { month: 'short' });
        counts[month] = (counts[month] || 0) + 1;
      }
    });
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }
};

// Re-export ATK services from atkSupabaseService
export * from './atkSupabaseService';
