-- Supabase Schema for ATK Management
-- Run this in Supabase SQL Editor

-- ATK Categories
CREATE TABLE IF NOT EXISTS atk_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATK Items (Master Data)
CREATE TABLE IF NOT EXISTS atk_items (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INT REFERENCES atk_categories(id) ON DELETE SET NULL,
    unit VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10,2) DEFAULT 0,
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 5,
    max_stock INT DEFAULT 100,
    supplier_id INT,
    location VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATK Stock Transactions
CREATE TABLE IF NOT EXISTS atk_stock_transactions (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES atk_items(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('IN', 'OUT', 'ADJUSTMENT', 'OPNAME')),
    quantity INT NOT NULL,
    previous_stock INT,
    new_stock INT,
    reference_type VARCHAR(50),
    reference_id INT,
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATK Requests
CREATE TABLE IF NOT EXISTS atk_requests (
    id SERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    employee_id INT,
    employee_name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    request_date DATE DEFAULT CURRENT_DATE,
    needed_date DATE,
    purpose TEXT,
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Rejected', 'Partial', 'Completed', 'Cancelled')),
    approved_by VARCHAR(255),
    approved_date TIMESTAMPTZ,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ATK Request Items
CREATE TABLE IF NOT EXISTS atk_request_items (
    id SERIAL PRIMARY KEY,
    request_id INT REFERENCES atk_requests(id) ON DELETE CASCADE,
    item_id INT REFERENCES atk_items(id) ON DELETE CASCADE,
    quantity_requested INT NOT NULL,
    quantity_approved INT DEFAULT 0,
    quantity_issued INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Partial', 'Issued')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE atk_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE atk_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE atk_stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE atk_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE atk_request_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth requirements)
CREATE POLICY "Allow all access to atk_categories" ON atk_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to atk_items" ON atk_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to atk_stock_transactions" ON atk_stock_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to atk_requests" ON atk_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to atk_request_items" ON atk_request_items FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_atk_items_category ON atk_items(category_id);
CREATE INDEX idx_atk_items_active ON atk_items(is_active);
CREATE INDEX idx_atk_transactions_item ON atk_stock_transactions(item_id);
CREATE INDEX idx_atk_transactions_date ON atk_stock_transactions(created_at);
CREATE INDEX idx_atk_requests_status ON atk_requests(status);
CREATE INDEX idx_atk_requests_date ON atk_requests(request_date);
CREATE INDEX idx_atk_request_items_request ON atk_request_items(request_id);

-- Insert sample categories
INSERT INTO atk_categories (code, name, description) VALUES
('CAT-001', 'Paper & Printing', 'Kertas dan perlengkapan cetak'),
('CAT-002', 'Writing Tools', 'Alat tulis'),
('CAT-003', 'Filing & Storage', 'Perlengkapan arsip'),
('CAT-004', 'Desk Accessories', 'Aksesoris meja'),
('CAT-005', 'Computer Supplies', 'Perlengkapan komputer')
ON CONFLICT (code) DO NOTHING;

-- Insert sample items
INSERT INTO atk_items (code, name, category_id, unit, unit_price, stock, min_stock, max_stock, location, is_active) VALUES
('ATK-001', 'A4 Paper (80gsm)', 1, 'Rim', 55000, 45, 10, 100, 'Gudang A', true),
('ATK-002', 'Ballpoint Pen (Black)', 2, 'Pcs', 3500, 120, 50, 200, 'Gudang A', true),
('ATK-003', 'Ballpoint Pen (Blue)', 2, 'Pcs', 3500, 85, 50, 200, 'Gudang A', true),
('ATK-004', 'Stapler No. 10', 4, 'Pcs', 25000, 15, 5, 30, 'Gudang B', true),
('ATK-005', 'Staples Refill No. 10', 4, 'Box', 8000, 50, 20, 100, 'Gudang B', true),
('ATK-006', 'Post-it Notes (Yellow)', 1, 'Pad', 15000, 30, 10, 50, 'Gudang A', true),
('ATK-007', 'Bantex Folder (Blue)', 3, 'Pcs', 12000, 8, 15, 50, 'Gudang B', true),
('ATK-008', 'Toner HP 85A', 5, 'Pcs', 450000, 3, 5, 15, 'Gudang C', true)
ON CONFLICT (code) DO NOTHING;
