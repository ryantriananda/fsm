import { supabase } from './supabase';
import { ATKCategory, ATKItem, ATKRequest, ATKRequestItem, ATKStockTransaction } from '../types';

// ATK Categories
export const atkCategoryService = {
  async getAll(): Promise<ATKCategory[]> {
    try {
      const { data, error } = await supabase
        .from('atk_categories')
        .select('*')
        .order('name');
      if (error) {
        console.warn('Error fetching categories:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.warn('Error:', err);
      return [];
    }
  },

  async create(category: Partial<ATKCategory>): Promise<ATKCategory> {
    const { data, error } = await supabase
      .from('atk_categories')
      .insert([{ code: category.code, name: category.name, description: category.description }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string | number, category: Partial<ATKCategory>): Promise<ATKCategory> {
    const { data, error } = await supabase
      .from('atk_categories')
      .update({ code: category.code, name: category.name, description: category.description })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string | number): Promise<void> {
    const { error } = await supabase.from('atk_categories').delete().eq('id', id);
    if (error) throw error;
  }
};


// Helper: Generate code prefix from category name
const generateCodePrefix = (categoryName: string): string => {
  const prefixMap: Record<string, string> = {
    'Paper & Printing': 'PPR',
    'Writing Tools': 'WRT',
    'Filing & Storage': 'FIL',
    'Desk Accessories': 'DSK',
    'Computer Supplies': 'CMP',
  };
  
  // Check if category name matches known categories
  for (const [key, prefix] of Object.entries(prefixMap)) {
    if (categoryName.toLowerCase().includes(key.toLowerCase().split(' ')[0])) {
      return prefix;
    }
  }
  
  // Generate prefix from first 3 letters of category name
  return categoryName.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() || 'ATK';
};

// ATK Items
export const atkItemService = {
  async getAll(): Promise<ATKItem[]> {
    try {
      const { data, error } = await supabase.from('atk_items').select('*').order('name');
      if (error) {
        console.warn('Error fetching items:', error);
        return [];
      }
      const items = data || [];
      if (items.length > 0) {
        const { data: categories } = await supabase.from('atk_categories').select('id, name');
        const catMap = new Map((categories || []).map(c => [c.id, c.name]));
        return items.map(item => ({ ...item, category_name: catMap.get(item.category_id) || '' }));
      }
      return items;
    } catch (err) {
      console.warn('Error:', err);
      return [];
    }
  },

  // Generate auto code based on category
  async generateCode(categoryId: string | number): Promise<string> {
    try {
      // Get category name
      const { data: category } = await supabase
        .from('atk_categories')
        .select('name')
        .eq('id', categoryId)
        .single();
      
      const prefix = generateCodePrefix(category?.name || 'ATK');
      
      // Count existing items with same prefix
      const { data: existingItems } = await supabase
        .from('atk_items')
        .select('code')
        .like('code', `${prefix}-%`);
      
      const count = (existingItems || []).length + 1;
      return `${prefix}-${String(count).padStart(3, '0')}`;
    } catch (err) {
      console.warn('Error generating code:', err);
      return `ATK-${Date.now().toString().slice(-6)}`;
    }
  },

  async create(item: Partial<ATKItem>): Promise<ATKItem> {
    // Auto-generate code if not provided or empty
    let code = item.code;
    if (!code && item.category_id) {
      code = await this.generateCode(item.category_id);
    } else if (!code) {
      code = `ATK-${Date.now().toString().slice(-6)}`;
    }
    
    const insertData: any = {
      code, name: item.name, unit: item.unit,
      unit_price: item.unit_price || 0, stock: item.stock || 0,
      min_stock: item.min_stock || 5, max_stock: item.max_stock || 100,
      location: item.location || '', is_active: item.is_active ?? true
    };
    if (item.category_id) insertData.category_id = item.category_id;
    
    const { data, error } = await supabase.from('atk_items').insert([insertData]).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string | number, item: Partial<ATKItem>): Promise<ATKItem> {
    const { data, error } = await supabase.from('atk_items')
      .update({ code: item.code, name: item.name, unit: item.unit, unit_price: item.unit_price,
        stock: item.stock, min_stock: item.min_stock, max_stock: item.max_stock,
        location: item.location, is_active: item.is_active, category_id: item.category_id })
      .eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string | number): Promise<void> {
    const { error } = await supabase.from('atk_items').delete().eq('id', id);
    if (error) throw error;
  },

  async updateStock(id: string | number, newStock: number): Promise<void> {
    const { error } = await supabase.from('atk_items').update({ stock: newStock }).eq('id', id);
    if (error) throw error;
  }
};

// ATK Stock Transactions
export const atkTransactionService = {
  async getAll(): Promise<ATKStockTransaction[]> {
    try {
      const { data, error } = await supabase.from('atk_stock_transactions').select('*').order('created_at', { ascending: false });
      if (error) { console.warn('Transactions error:', error.message); return []; }
      const txs = data || [];
      if (txs.length > 0) {
        const { data: items } = await supabase.from('atk_items').select('id, name');
        const itemMap = new Map((items || []).map(i => [i.id, i.name]));
        return txs.map(tx => ({ ...tx, item_name: itemMap.get(tx.item_id) || '' }));
      }
      return txs;
    } catch (err) { console.warn('Error:', err); return []; }
  },

  async create(tx: Partial<ATKStockTransaction>): Promise<ATKStockTransaction | null> {
    try {
      const { data: item } = await supabase.from('atk_items').select('stock').eq('id', tx.item_id).single();
      const currentStock = item?.stock || 0;
      let newStock = tx.transaction_type === 'IN' ? currentStock + (tx.quantity || 0) : currentStock - (tx.quantity || 0);
      await atkItemService.updateStock(tx.item_id!, newStock);
      const { data } = await supabase.from('atk_stock_transactions')
        .insert([{ item_id: tx.item_id, transaction_type: tx.transaction_type, quantity: tx.quantity,
          previous_stock: currentStock, new_stock: newStock, reference_type: tx.reference_type,
          notes: tx.notes, created_by: tx.created_by }]).select().single();
      return data || { ...tx, previous_stock: currentStock, new_stock: newStock } as ATKStockTransaction;
    } catch (err) { console.warn('Transaction error:', err); return null; }
  }
};


// ATK Requests
export const atkRequestService = {
  async getAll(): Promise<ATKRequest[]> {
    try {
      const { data, error } = await supabase.from('atk_requests').select('*').order('id', { ascending: false });
      if (error) { console.warn('Requests error:', error.message); return []; }
      const requests: ATKRequest[] = [];
      for (const req of data || []) {
        try {
          const { data: reqItems } = await supabase.from('atk_request_items').select('*').eq('request_id', req.id);
          const itemsWithDetails = [];
          for (const ri of reqItems || []) {
            const { data: atkItem } = await supabase.from('atk_items').select('name, code, unit, stock').eq('id', ri.item_id).single();
            itemsWithDetails.push({ ...ri, item_name: atkItem?.name || '', item_code: atkItem?.code || '', unit: atkItem?.unit || '', available_stock: atkItem?.stock || 0 });
          }
          requests.push({ ...req, items: itemsWithDetails });
        } catch { requests.push({ ...req, items: [] }); }
      }
      return requests;
    } catch (err) { console.warn('Error:', err); return []; }
  },

  async create(request: Partial<ATKRequest>): Promise<ATKRequest> {
    const { count } = await supabase.from('atk_requests').select('*', { count: 'exact', head: true });
    const requestNumber = `REQ-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(3, '0')}`;
    const { data, error } = await supabase.from('atk_requests')
      .insert([{ request_number: requestNumber, employee_name: request.employee_name, department: request.department,
        request_date: request.request_date || new Date().toISOString().split('T')[0], needed_date: request.needed_date,
        purpose: request.purpose, status: request.status || 'Submitted', notes: request.notes }])
      .select().single();
    if (error) throw error;
    if (request.items && request.items.length > 0) {
      const itemsToInsert = request.items.map(item => ({ request_id: data.id, item_id: item.item_id, quantity_requested: item.quantity_requested, quantity_approved: 0, quantity_issued: 0, status: 'Pending' }));
      await supabase.from('atk_request_items').insert(itemsToInsert);
    }
    return { ...data, items: request.items || [] };
  },

  async approve(id: string | number, approvedBy: string, items: ATKRequestItem[]): Promise<void> {
    await supabase.from('atk_requests').update({ status: 'Approved', approved_by: approvedBy, approved_date: new Date().toISOString() }).eq('id', id);
    for (const item of items) {
      await supabase.from('atk_request_items').update({ quantity_approved: item.quantity_requested, status: 'Approved' }).eq('id', item.id);
      const { data: atkItem } = await supabase.from('atk_items').select('stock').eq('id', item.item_id).single();
      const newStock = (atkItem?.stock || 0) - item.quantity_requested;
      await supabase.from('atk_items').update({ stock: newStock }).eq('id', item.item_id);
    }
  },

  async reject(id: string | number, rejectedBy: string, reason: string): Promise<void> {
    await supabase.from('atk_requests').update({ status: 'Rejected', approved_by: rejectedBy, rejection_reason: reason }).eq('id', id);
    await supabase.from('atk_request_items').update({ status: 'Rejected' }).eq('request_id', id);
  },

  async delete(id: string | number): Promise<void> {
    await supabase.from('atk_request_items').delete().eq('request_id', id);
    await supabase.from('atk_requests').delete().eq('id', id);
  }
};
