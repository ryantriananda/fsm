-- Asset Categories
CREATE TABLE IF NOT EXISTS asset_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    depreciation VARCHAR(10),
    life INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Locations
CREATE TABLE IF NOT EXISTS asset_locations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    building VARCHAR(255),
    floor VARCHAR(50),
    room VARCHAR(255) NOT NULL,
    pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Status
CREATE TABLE IF NOT EXISTS asset_statuses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INT REFERENCES asset_categories(id),
    location_id INT REFERENCES asset_locations(id),
    status_id INT REFERENCES asset_statuses(id),
    vendor_id INT REFERENCES vendors(id),
    acquisition_cost DECIMAL(15,2),
    residual_value DECIMAL(15,2),
    useful_life INT,
    depreciation_method VARCHAR(50),
    book_value DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    party_name VARCHAR(255),
    type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    value DECIMAL(15,2),
    asset_id INT REFERENCES assets(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATK Categories
CREATE TABLE IF NOT EXISTS atk_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATK Items (Master Data)
CREATE TABLE IF NOT EXISTS atk_items (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INT REFERENCES atk_categories(id),
    unit VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10,2) DEFAULT 0,
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 5,
    max_stock INT DEFAULT 100,
    supplier_id INT REFERENCES vendors(id),
    location VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATK Stock Transactions (In/Out)
CREATE TABLE IF NOT EXISTS atk_stock_transactions (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES atk_items(id),
    transaction_type VARCHAR(20) NOT NULL, -- 'IN', 'OUT', 'ADJUSTMENT', 'OPNAME'
    quantity INT NOT NULL,
    previous_stock INT,
    new_stock INT,
    reference_type VARCHAR(50), -- 'PURCHASE', 'REQUEST', 'RETURN', 'OPNAME'
    reference_id INT,
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    status VARCHAR(20) DEFAULT 'Draft', -- 'Draft', 'Submitted', 'Approved', 'Rejected', 'Partial', 'Completed', 'Cancelled'
    approved_by VARCHAR(255),
    approved_date TIMESTAMP,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATK Request Items
CREATE TABLE IF NOT EXISTS atk_request_items (
    id SERIAL PRIMARY KEY,
    request_id INT REFERENCES atk_requests(id) ON DELETE CASCADE,
    item_id INT REFERENCES atk_items(id),
    quantity_requested INT NOT NULL,
    quantity_approved INT DEFAULT 0,
    quantity_issued INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected', 'Partial', 'Issued'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATK Purchase Orders
CREATE TABLE IF NOT EXISTS atk_purchase_orders (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INT REFERENCES vendors(id),
    order_date DATE DEFAULT CURRENT_DATE,
    expected_date DATE,
    received_date DATE,
    status VARCHAR(20) DEFAULT 'Draft', -- 'Draft', 'Submitted', 'Approved', 'Ordered', 'Partial', 'Received', 'Cancelled'
    total_amount DECIMAL(15,2) DEFAULT 0,
    approved_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATK Purchase Order Items
CREATE TABLE IF NOT EXISTS atk_purchase_order_items (
    id SERIAL PRIMARY KEY,
    po_id INT REFERENCES atk_purchase_orders(id) ON DELETE CASCADE,
    item_id INT REFERENCES atk_items(id),
    quantity_ordered INT NOT NULL,
    quantity_received INT DEFAULT 0,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Partial', 'Received'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATK Stock Opname
CREATE TABLE IF NOT EXISTS atk_stock_opname (
    id SERIAL PRIMARY KEY,
    opname_number VARCHAR(50) UNIQUE NOT NULL,
    opname_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Draft', -- 'Draft', 'In Progress', 'Completed', 'Approved'
    conducted_by VARCHAR(255),
    approved_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATK Stock Opname Items
CREATE TABLE IF NOT EXISTS atk_stock_opname_items (
    id SERIAL PRIMARY KEY,
    opname_id INT REFERENCES atk_stock_opname(id) ON DELETE CASCADE,
    item_id INT REFERENCES atk_items(id),
    system_stock INT,
    actual_stock INT,
    difference INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ARK (Alat Rumah Tangga Kantor)
CREATE TABLE IF NOT EXISTS ark (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INT,
    location_id INT REFERENCES asset_locations(id),
    condition VARCHAR(50),
    asset_id INT REFERENCES assets(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timesheet
CREATE TABLE IF NOT EXISTS timesheets (
    id SERIAL PRIMARY KEY,
    employee_id INT,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    hours_worked DECIMAL(5,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Credit Card
CREATE TABLE IF NOT EXISTS credit_cards (
    id SERIAL PRIMARY KEY,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    holder_name VARCHAR(255),
    card_type VARCHAR(50),
    limit_amount DECIMAL(15,2),
    balance DECIMAL(15,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Log Book
CREATE TABLE IF NOT EXISTS log_books (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    activity VARCHAR(255),
    description TEXT,
    user_name VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Management
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    budget DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Schedules
CREATE TABLE IF NOT EXISTS maintenance_schedules (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id),
    maintenance_type_id INT REFERENCES maintenance_types(id),
    interval VARCHAR(50),
    last_date DATE,
    next_date DATE,
    vendor_id INT REFERENCES vendors(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Types
CREATE TABLE IF NOT EXISTS maintenance_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sla INT,
    est_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spareparts
CREATE TABLE IF NOT EXISTS spareparts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    stock INT,
    min_stock INT,
    unit VARCHAR(50),
    asset_id INT REFERENCES assets(id),
    vendor_id INT REFERENCES vendors(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disposals
CREATE TABLE IF NOT EXISTS disposals (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    type VARCHAR(50),
    asset_id INT REFERENCES assets(id),
    details TEXT,
    value DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Documents
CREATE TABLE IF NOT EXISTS asset_documents (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id),
    doc_type VARCHAR(50),
    doc_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Roles
CREATE TABLE IF NOT EXISTS asset_roles (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    department VARCHAR(100),
    role VARCHAR(50),
    approval_limit DECIMAL(15,2),
    menu_access TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
