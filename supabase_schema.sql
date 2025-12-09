-- =====================================================
-- SUPABASE COMPLETE SCHEMA FOR FSM (Facility Management System)
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. VENDORS (harus dibuat duluan karena di-reference)
-- =====================================================
CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    service_type VARCHAR(100),
    rating INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. ASSET MANAGEMENT
-- =====================================================

-- Asset Categories
CREATE TABLE IF NOT EXISTS asset_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    depreciation VARCHAR(20),
    life INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset Locations
CREATE TABLE IF NOT EXISTS asset_locations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    building VARCHAR(255),
    floor VARCHAR(50),
    room VARCHAR(255) NOT NULL,
    pic VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset Statuses
CREATE TABLE IF NOT EXISTS asset_statuses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active VARCHAR(10) DEFAULT 'Yes',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Assets
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INT REFERENCES asset_categories(id) ON DELETE SET NULL,
    location_id INT REFERENCES asset_locations(id) ON DELETE SET NULL,
    status_id INT REFERENCES asset_statuses(id) ON DELETE SET NULL,
    vendor_id INT REFERENCES vendors(id) ON DELETE SET NULL,
    serial_number VARCHAR(100),
    purchase_date DATE,
    acquisition_cost DECIMAL(15,2) DEFAULT 0,
    residual_value DECIMAL(15,2) DEFAULT 0,
    useful_life INT,
    depreciation_method VARCHAR(50),
    book_value DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Types
CREATE TABLE IF NOT EXISTS maintenance_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sla INT,
    est_cost DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Schedules
CREATE TABLE IF NOT EXISTS maintenance_schedules (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    maintenance_type_id INT REFERENCES maintenance_types(id) ON DELETE SET NULL,
    interval VARCHAR(50),
    last_date DATE,
    next_date DATE,
    vendor_id INT REFERENCES vendors(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disposals
CREATE TABLE IF NOT EXISTS disposals (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    type VARCHAR(50),
    asset_id INT REFERENCES assets(id) ON DELETE SET NULL,
    details TEXT,
    value DECIMAL(15,2) DEFAULT 0,
    approved_by VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset Documents
CREATE TABLE IF NOT EXISTS asset_documents (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    doc_type VARCHAR(50),
    doc_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    notes TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spareparts
CREATE TABLE IF NOT EXISTS spareparts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 5,
    unit VARCHAR(50),
    unit_price DECIMAL(15,2) DEFAULT 0,
    asset_id INT REFERENCES assets(id) ON DELETE SET NULL,
    vendor_id INT REFERENCES vendors(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. CONTRACTS
-- =====================================================
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    party_name VARCHAR(255),
    type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    value DECIMAL(15,2) DEFAULT 0,
    asset_id INT REFERENCES assets(id) ON DELETE SET NULL,
    vendor_id INT REFERENCES vendors(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- 4. ATK (Alat Tulis Kantor)
-- =====================================================

-- ATK Categories
CREATE TABLE IF NOT EXISTS atk_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATK Items
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
    supplier_id INT REFERENCES vendors(id) ON DELETE SET NULL,
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
    transaction_type VARCHAR(20) NOT NULL,
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
    status VARCHAR(20) DEFAULT 'Draft',
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
    status VARCHAR(20) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. ARK (Alat Rumah Tangga Kantor)
-- =====================================================
CREATE TABLE IF NOT EXISTS ark_items (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INT DEFAULT 1,
    location_id INT REFERENCES asset_locations(id) ON DELETE SET NULL,
    condition VARCHAR(50) DEFAULT 'Good',
    asset_id INT REFERENCES assets(id) ON DELETE SET NULL,
    last_checked DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. EMPLOYEES
-- =====================================================
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    nik VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    join_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    manager_id INT REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. LEAVE MANAGEMENT
-- =====================================================
CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INT,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    approved_by VARCHAR(255),
    approved_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- 8. TIMESHEET
-- =====================================================
CREATE TABLE IF NOT EXISTS timesheets (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(255),
    date DATE NOT NULL,
    project VARCHAR(255),
    task VARCHAR(255),
    check_in TIME,
    check_out TIME,
    hours_worked DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'Submitted',
    approved_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. CREDIT CARDS
-- =====================================================
CREATE TABLE IF NOT EXISTS credit_cards (
    id SERIAL PRIMARY KEY,
    card_number VARCHAR(20),
    last_four_digits VARCHAR(4),
    holder_name VARCHAR(255) NOT NULL,
    bank VARCHAR(100),
    card_type VARCHAR(50),
    limit_amount DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    expiry_date VARCHAR(10),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit Card Transactions
CREATE TABLE IF NOT EXISTS credit_card_transactions (
    id SERIAL PRIMARY KEY,
    card_id INT REFERENCES credit_cards(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT,
    amount DECIMAL(15,2),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. LOG BOOK
-- =====================================================
CREATE TABLE IF NOT EXISTS log_books (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    activity VARCHAR(255) NOT NULL,
    description TEXT,
    asset_name VARCHAR(255),
    asset_id INT REFERENCES assets(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    severity VARCHAR(50) DEFAULT 'Normal',
    status VARCHAR(50) DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. PROJECTS
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager VARCHAR(255),
    start_date DATE,
    end_date DATE,
    deadline DATE,
    progress INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Planning',
    budget DECIMAL(15,2) DEFAULT 0,
    team_size INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Tasks
CREATE TABLE IF NOT EXISTS project_tasks (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    assignee VARCHAR(255),
    due_date DATE,
    priority VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'Todo',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 12. ROLES & PERMISSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    module VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
    granted BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Asset Roles (legacy support)
CREATE TABLE IF NOT EXISTS asset_roles (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    department VARCHAR(100),
    role VARCHAR(50),
    approval_limit DECIMAL(15,2) DEFAULT 0,
    menu_access TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE disposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE spareparts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE atk_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE atk_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE atk_stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE atk_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE atk_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ark_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE POLICIES (Public Access for Development)
-- =====================================================
CREATE POLICY "public_vendors" ON vendors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_asset_categories" ON asset_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_asset_locations" ON asset_locations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_asset_statuses" ON asset_statuses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_assets" ON assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_maintenance_types" ON maintenance_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_maintenance_schedules" ON maintenance_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_disposals" ON disposals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_asset_documents" ON asset_documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_spareparts" ON spareparts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_contracts" ON contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_atk_categories" ON atk_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_atk_items" ON atk_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_atk_stock_transactions" ON atk_stock_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_atk_requests" ON atk_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_atk_request_items" ON atk_request_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_ark_items" ON ark_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_employees" ON employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_leave_requests" ON leave_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_timesheets" ON timesheets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_credit_cards" ON credit_cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_credit_card_transactions" ON credit_card_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_log_books" ON log_books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_project_tasks" ON project_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_roles" ON roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_permissions" ON permissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_role_permissions" ON role_permissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_asset_roles" ON asset_roles FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- CREATE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(location_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_asset ON maintenance_schedules(asset_id);
CREATE INDEX IF NOT EXISTS idx_contracts_asset ON contracts(asset_id);
CREATE INDEX IF NOT EXISTS idx_atk_items_category ON atk_items(category_id);
CREATE INDEX IF NOT EXISTS idx_atk_requests_status ON atk_requests(status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_leave_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_employee ON timesheets(employee_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);


-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Vendors
INSERT INTO vendors (code, name, contact_person, email, phone, city, service_type, status) VALUES
('VND-001', 'PT Mitra Sejahtera', 'John Doe', 'john@mitra.com', '021-1234567', 'Jakarta', 'Supplier', 'Active'),
('VND-002', 'CV Berkah Jaya', 'Jane Smith', 'jane@berkah.com', '021-7654321', 'Bandung', 'Maintenance', 'Active'),
('VND-003', 'PT Cleaning Pro', 'Bob Wilson', 'bob@cleanpro.com', '021-9876543', 'Jakarta', 'Cleaning', 'Active')
ON CONFLICT (code) DO NOTHING;

-- Asset Categories
INSERT INTO asset_categories (code, name, type, depreciation, life) VALUES
('CAT-001', 'Computer & IT', 'IT Equipment', '20%', 5),
('CAT-002', 'Furniture', 'Office Furniture', '10%', 10),
('CAT-003', 'Vehicle', 'Transportation', '20%', 5),
('CAT-004', 'Building', 'Property', '5%', 20),
('CAT-005', 'Machinery', 'Production', '15%', 7)
ON CONFLICT (code) DO NOTHING;

-- Asset Locations
INSERT INTO asset_locations (code, building, floor, room, pic) VALUES
('LOC-001', 'Main Building', '1', 'Lobby', 'Security'),
('LOC-002', 'Main Building', '2', 'IT Room', 'IT Admin'),
('LOC-003', 'Main Building', '3', 'Meeting Room A', 'GA'),
('LOC-004', 'Warehouse', '1', 'Storage A', 'Warehouse Staff'),
('LOC-005', 'Main Building', '2', 'Finance Dept', 'Finance Admin')
ON CONFLICT (code) DO NOTHING;

-- Asset Statuses
INSERT INTO asset_statuses (code, name, description, is_active) VALUES
('STS-001', 'Active', 'Asset is in use', 'Yes'),
('STS-002', 'In Maintenance', 'Asset under repair', 'Yes'),
('STS-003', 'Disposed', 'Asset has been disposed', 'No'),
('STS-004', 'Reserved', 'Asset reserved for project', 'Yes'),
('STS-005', 'Damaged', 'Asset is damaged', 'Yes')
ON CONFLICT (code) DO NOTHING;

-- Assets
INSERT INTO assets (code, name, category_id, location_id, status_id, serial_number, purchase_date, acquisition_cost, book_value) VALUES
('AST-001', 'Dell Laptop XPS 15', 1, 2, 1, 'DL-XPS-001', '2024-01-15', 25000000, 20000000),
('AST-002', 'Office Desk Executive', 2, 5, 1, 'DSK-EXC-001', '2023-06-01', 5000000, 4500000),
('AST-003', 'Toyota Avanza', 3, 4, 1, 'B-1234-ABC', '2023-01-01', 250000000, 200000000),
('AST-004', 'HP Printer LaserJet', 1, 2, 1, 'HP-LJ-001', '2024-03-01', 8000000, 7500000),
('AST-005', 'Meeting Table Large', 2, 3, 1, 'TBL-MTG-001', '2023-08-15', 15000000, 13500000)
ON CONFLICT (code) DO NOTHING;

-- Maintenance Types
INSERT INTO maintenance_types (code, name, sla, est_cost) VALUES
('MT-001', 'Preventive Maintenance', 7, 500000),
('MT-002', 'Corrective Maintenance', 3, 1000000),
('MT-003', 'Emergency Repair', 1, 2000000),
('MT-004', 'Routine Inspection', 14, 200000)
ON CONFLICT (code) DO NOTHING;

-- ATK Categories
INSERT INTO atk_categories (code, name, description) VALUES
('ATKC-001', 'Paper & Printing', 'Kertas dan perlengkapan cetak'),
('ATKC-002', 'Writing Tools', 'Alat tulis'),
('ATKC-003', 'Filing & Storage', 'Perlengkapan arsip'),
('ATKC-004', 'Desk Accessories', 'Aksesoris meja'),
('ATKC-005', 'Computer Supplies', 'Perlengkapan komputer')
ON CONFLICT (code) DO NOTHING;

-- ATK Items
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

-- Employees
INSERT INTO employees (nik, name, email, department, position, join_date, status) VALUES
('EMP-001', 'John Smith', 'john.smith@company.com', 'IT', 'IT Manager', '2020-01-15', 'Active'),
('EMP-002', 'Sarah Johnson', 'sarah.j@company.com', 'HR', 'HR Manager', '2019-06-01', 'Active'),
('EMP-003', 'Mike Wilson', 'mike.w@company.com', 'Finance', 'Finance Staff', '2021-03-01', 'Active'),
('EMP-004', 'Emily Brown', 'emily.b@company.com', 'Marketing', 'Marketing Lead', '2020-08-15', 'Active'),
('EMP-005', 'David Lee', 'david.l@company.com', 'Operations', 'Operations Manager', '2018-11-01', 'Active')
ON CONFLICT (nik) DO NOTHING;

-- Projects
INSERT INTO projects (code, name, description, manager, start_date, end_date, progress, status, budget, team_size) VALUES
('PRJ-001', 'Office Renovation', 'Renovasi kantor lantai 2', 'John Smith', '2024-01-01', '2024-06-30', 65, 'In Progress', 500000000, 5),
('PRJ-002', 'IT Infrastructure Upgrade', 'Upgrade server dan network', 'Mike Wilson', '2024-02-01', '2024-04-30', 80, 'In Progress', 200000000, 3),
('PRJ-003', 'New Branch Setup', 'Setup kantor cabang baru', 'David Lee', '2024-03-01', '2024-12-31', 25, 'Planning', 1000000000, 8)
ON CONFLICT (code) DO NOTHING;

-- Roles
INSERT INTO roles (name, description, is_system) VALUES
('Admin', 'Full system access', true),
('Manager', 'Department manager access', true),
('Staff', 'Regular staff access', true),
('Viewer', 'Read-only access', true)
ON CONFLICT (name) DO NOTHING;

-- Contracts
INSERT INTO contracts (code, title, party_name, type, start_date, end_date, status, value) VALUES
('CTR-001', 'Office Cleaning Service', 'PT Cleaning Pro', 'Vendor', '2024-01-01', '2024-12-31', 'Active', 120000000),
('CTR-002', 'IT Support Agreement', 'PT Tech Support', 'Vendor', '2024-01-01', '2025-12-31', 'Active', 240000000),
('CTR-003', 'Building Maintenance', 'CV Berkah Jaya', 'Vendor', '2024-06-01', '2025-05-31', 'Active', 180000000)
ON CONFLICT (code) DO NOTHING;

SELECT 'Schema and sample data created successfully!' as result;
