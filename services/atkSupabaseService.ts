import { supabase } from './supabase';
import { ATKCategory, ATKItem, ATKRequest, ATKRequestItem, ATKStockTransaction } from '../types';

// ATK Categories
export const atkCategoryService = {
  async getAll(): Promise<ATKCategory[]> {
    const { data, error } = await supabase
      .from('atk_categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
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

  async update(id: number, category: Partial<ATKCategory>): Promise<ATKCategory> {
    const { data, error } = await supabase
      .from('atk_categories')
      .update({ code: category.code, name: category.name, description: category.description, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from('atk_categories').delete().eq('id', id);
    if (error) throw error;
  }
};

// ATK Items
export const atkItemService = {
  async getAll(): Promise<ATKItem[]> {
    const { data, error } = await supabase
      .from('atk_items')
      .select(`*, atk_categories(name)`)
      .order('name');
    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      category_name: item.atk_categories?.name || ''
    }));
  },

  async create(item: Partial<ATKItem>): Promise<ATKItem> {
    const { data, error } = await supabase
      .from('atk_items')
      .insert([{
        code: item.code,
        name: item.name,
        category_id: item.category_id,
        unit: item.unit,
        unit_price: item.unit_price || 0,
        stock: item.stock || 0,
        min_stock: item.min_stock || 5,
        max_stock: item.max_stock || 100,
        supplier_id: item.supplier_id,
        location: item.location,
        description: item.description,
        is_active: item.is_active ?? true
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: number, item: Partial<ATKItem>): Promise<ATKItem> {
    const { data, error } = await supabase
      .from('atk_items')
      .update({
        code: item.code,
        name: item.name,
        category_id: item.category_id,
        unit: item.unit,
        unit_price: item.unit_price,
        stock: item.stock,
        min_stock: item.min_stock,
        max_stock: item.max_stock,
        supplier_id: item.supplier_id,
        location: item.location,
        description: item.description,
        is_active: item.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from('atk_items').delete().eq('id', id);
    if (error) throw error;
  },

  async updateStock(id: number, newStock: number): Promise<void> {
    const { error } = await supabase
      .from('atk_items')
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }
};

// ATK Stock Transactions
export const atkTransactionService = {
  async getAll(): Promise<ATKStockTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('atk_stock_transactions')
        .select(`*, atk_items(name)`)
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('atk_stock_transactions table not found, returning empty array');
        return [];
      }
      return (data || []).map(tx => ({
        ...tx,
        item_name: tx.atk_items?.name || ''
      }));
    } catch (err) {
      console.warn('Error fetching transactions:', err);
      return [];
    }
  },

  async create(transaction: Partial<ATKStockTransaction>): Promise<ATKStockTransaction | null> {
    // Get current stock
    const { data: item } = await supabase
      .from('atk_items')
      .select('stock')
      .eq('id', transaction.item_id)
      .single();
    
    const currentStock = item?.stock || 0;
    let newStock = currentStock;
    
    if (transaction.transaction_type === 'IN') {
      newStock = currentStock + (transaction.quantity || 0);
    } else if (transaction.transaction_type === 'OUT') {
      newStock = currentStock - (transaction.quantity || 0);
    } else {
      newStock = transaction.quantity || 0;
    }

    // Update item stock first (this should always work)
    await atkItemService.updateStock(transaction.item_id!, newStock);

    // Try to insert transaction record
    try {
      const { data, error } = await supabase
        .from('atk_stock_transactions')
        .insert([{
          item_id: transaction.item_id,
          transaction_type: transaction.transaction_type,
          quantity: transaction.quantity,
          previous_stock: currentStock,
          new_stock: newStock,
          reference_type: transaction.reference_type,
          reference_id: transaction.reference_id,
          notes: transaction.notes,
          created_by: transaction.created_by
        }])
        .select()
        .single();
      
      if (error) {
        console.warn('Could not record transaction, but stock was updated');
        return { ...transaction, previous_stock: currentStock, new_stock: newStock } as ATKStockTransaction;
      }
      return data;
    } catch (err) {
      console.warn('Transaction table not available, but stock was updated');
      return { ...transaction, previous_stock: currentStock, new_stock: newStock } as ATKStockTransaction;
    }
  }
};


// ATK Requests
export const atkRequestService = {
  async getAll(): Promise<ATKRequest[]> {
    const { data, error } = await supabase
      .from('atk_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    // Get items for each request
    const requests: ATKRequest[] = [];
    for (const req of data || []) {
      const { data: items } = await supabase
        .from('atk_request_items')
        .select(`*, atk_items(name, code, unit, stock)`)
        .eq('request_id', req.id);
      
      requests.push({
        ...req,
        items: (items || []).map(item => ({
          ...item,
          item_name: item.atk_items?.name || '',
          item_code: item.atk_items?.code || '',
          unit: item.atk_items?.unit || '',
          available_stock: item.atk_items?.stock || 0
        }))
      });
    }
    return requests;
  },

  async create(request: Partial<ATKRequest>): Promise<ATKRequest> {
    // Generate request number
    const { count } = await supabase
      .from('atk_requests')
      .select('*', { count: 'exact', head: true });
    const requestNumber = `REQ-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(3, '0')}`;

    const { data, error } = await supabase
      .from('atk_requests')
      .insert([{
        request_number: requestNumber,
        employee_id: request.employee_id,
        employee_name: request.employee_name,
        department: request.department,
        request_date: request.request_date || new Date().toISOString().split('T')[0],
        needed_date: request.needed_date,
        purpose: request.purpose,
        status: request.status || 'Submitted',
        notes: request.notes
      }])
      .select()
      .single();
    if (error) throw error;

    // Insert items
    if (request.items && request.items.length > 0) {
      const itemsToInsert = request.items.map(item => ({
        request_id: data.id,
        item_id: item.item_id,
        quantity_requested: item.quantity_requested,
        quantity_approved: 0,
        quantity_issued: 0,
        status: 'Pending',
        notes: item.notes
      }));

      const { error: itemError } = await supabase
        .from('atk_request_items')
        .insert(itemsToInsert);
      if (itemError) throw itemError;
    }

    return { ...data, items: request.items || [] };
  },

  async approve(id: number, approvedBy: string, items: ATKRequestItem[]): Promise<void> {
    // Update request status
    const { error } = await supabase
      .from('atk_requests')
      .update({
        status: 'Approved',
        approved_by: approvedBy,
        approved_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) throw error;

    // Update items and deduct stock
    for (const item of items) {
      // Update item status
      await supabase
        .from('atk_request_items')
        .update({
          quantity_approved: item.quantity_requested,
          status: 'Approved'
        })
        .eq('id', item.id);

      // Get current stock
      const { data: atkItem } = await supabase
        .from('atk_items')
        .select('stock')
        .eq('id', item.item_id)
        .single();

      const currentStock = atkItem?.stock || 0;
      const newStock = currentStock - item.quantity_requested;

      // Update stock
      await supabase
        .from('atk_items')
        .update({ stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', item.item_id);

      // Try to record transaction (may fail if table doesn't exist)
      try {
        await supabase
          .from('atk_stock_transactions')
          .insert([{
            item_id: item.item_id,
            transaction_type: 'OUT',
            quantity: item.quantity_requested,
            previous_stock: currentStock,
            new_stock: newStock,
            reference_type: 'REQUEST',
            reference_id: id,
            notes: `Request approved`,
            created_by: approvedBy
          }]);
      } catch (err) {
        console.warn('Could not record transaction history');
      }
    }
  },

  async reject(id: number, rejectedBy: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('atk_requests')
      .update({
        status: 'Rejected',
        approved_by: rejectedBy,
        approved_date: new Date().toISOString(),
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) throw error;

    // Update all items to rejected
    await supabase
      .from('atk_request_items')
      .update({ status: 'Rejected' })
      .eq('request_id', id);
  },

  async delete(id: number): Promise<void> {
    // Delete items first
    await supabase.from('atk_request_items').delete().eq('request_id', id);
    // Delete request
    const { error } = await supabase.from('atk_requests').delete().eq('id', id);
    if (error) throw error;
  }
};
