import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ryfflegbywjmmykdojay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZmZsZWdieXdqbW15a2RvamF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNTk2NDUsImV4cCI6MjA4MDgzNTY0NX0._3TfYjWENqk6wmZcW7daENBYcv4DOa1JARokuRTDuRk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      atk_categories: {
        Row: {
          id: number;
          code: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['atk_categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['atk_categories']['Insert']>;
      };
      atk_items: {
        Row: {
          id: number;
          code: string;
          name: string;
          category_id: number | null;
          unit: string;
          unit_price: number;
          stock: number;
          min_stock: number;
          max_stock: number;
          supplier_id: number | null;
          location: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['atk_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['atk_items']['Insert']>;
      };
    };
  };
};
