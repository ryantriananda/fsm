# Functional Specification Document (FSD)
## Facility & Asset Management System (FMS)

---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen Functional Specification Document (FSD) ini bertujuan untuk mendefinisikan secara lengkap, detail, dan terstruktur seluruh fungsi sistem Facility & Asset Management System (FMS). 

Dokumen ini menjadi acuan tunggal bagi:
- Tim Developer
- QA / Tester
- Product Owner
- Stakeholder bisnis

### 1.2 Ruang Lingkup Sistem

Sistem FMS mencakup:
- ✅ Manajemen Asset Perusahaan (end-to-end lifecycle)
- ✅ Maintenance & Facility Operations
- ✅ HR & General Affair (GA)
- ✅ Finance & Compliance
- ✅ Approval Workflow & Audit Trail

### 1.3 Definisi Singkatan

| Singkatan | Arti |
|-----------|------|
| FMS | Facility Management System |
| GA | General Affair |
| RBAC | Role Based Access Control |
| SLA | Service Level Agreement |
| ATK | Alat Tulis Kantor |
| ARK | Alat Rumah Tangga Kantor |
| FK | Foreign Key |
| PK | Primary Key |
| JWT | JSON Web Token |
| ERD | Entity Relationship Diagram |

---

## 2. OVERVIEW SISTEM

### 2.1 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React)                      │
│              Web Application + UI Components            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│                   Backend (Go)                          │
│              REST API + Business Logic                  │
└────────────────────┬────────────────────────────────────┘
                     │ SQL
┌────────────────────▼────────────────────────────────────┐
│              Database (PostgreSQL)                      │
│         Relational Data Storage + Audit Trail           │
└─────────────────────────────────────────────────────────┘
```

**Komponen Teknis:**
- Frontend: Web Application (React + TypeScript)
- Backend: REST API (Go + Gorilla Mux)
- Database: PostgreSQL
- Authentication: Email + Password (hashed)
- Authorization: RBAC berbasis role

### 2.2 Role Pengguna

| Role | Deskripsi | Akses |
|------|-----------|-------|
| Admin | Konfigurasi & akses penuh | Semua menu |
| GA | Pengelola asset & fasilitas | Asset, Maintenance, ATK |
| HR | Manajemen karyawan & cuti | Employee, Leave, Timesheet |
| Finance | Penyusutan, CC, nilai asset | Asset Valuation, CC, Reports |
| Manager | Approval & monitoring | Approval workflows |
| Employee | Request & view terbatas | ATK Request, Leave, View Own |

### 2.3 Prinsip Desain

1. **Single Source of Truth** - Satu data, satu tempat
2. **Audit Trail** - Semua perubahan tercatat
3. **Workflow-based** - Approval dan persetujuan terstruktur
4. **Role-based Access** - Kontrol akses berbasis peran
5. **Data Integrity** - Foreign key dan constraint ketat

---

## 3. MODUL CORE: USER & AUTHENTICATION

### 3.1 Department Management

**Tabel:** `departments`

**Fungsi:**
- Membuat dan mengelola departemen
- Digunakan sebagai referensi user & asset
- Organisasi struktur perusahaan

**Fields:**
```
id (UUID, PK)
code (VARCHAR, UNIQUE)
name (VARCHAR)
description (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Rules:**
- Kode department harus unik
- Tidak boleh ada duplikasi nama dalam satu perusahaan
- Soft delete untuk audit trail

### 3.2 User Management

**Tabel:** `users`

**Fungsi:**
- Registrasi user
- Assign role & department
- Aktivasi / deaktivasi user
- Password management

**Fields:**
```
id (UUID, PK)
email (VARCHAR, UNIQUE)
password_hash (VARCHAR)
full_name (VARCHAR)
role (ENUM: admin, ga, hr, finance, manager, employee)
department_id (UUID, FK → departments)
status (ENUM: active, inactive, suspended)
last_login (TIMESTAMP)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Aturan Akses:**
- Hanya Admin & HR yang bisa manage users
- Password harus di-hash menggunakan bcrypt
- Email harus verified sebelum login

### 3.3 Employee Management

**Tabel:** `employees`

**Fungsi:**
- Data karyawan internal
- Relasi 1 user → 1 employee
- Tracking informasi personal & employment

**Fields:**
```
id (UUID, PK)
user_id (UUID, FK → users, UNIQUE)
nik (VARCHAR, UNIQUE)
position (VARCHAR)
join_date (DATE)
phone (VARCHAR)
address (TEXT)
manager_id (UUID, FK → users)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Relasi:**
- 1 user hanya bisa 1 employee
- Manager adalah user lain (self-referencing)

---

## 4. MASTER DATA

### 4.1 Master Kategori Asset

**Tabel:** `asset_categories`

**Fungsi:**
- Mengelompokkan asset
- Mendefinisikan apakah asset depresiasiasi
- Menentukan umur ekonomis

**Fields:**
```
id (UUID, PK)
code (VARCHAR, UNIQUE)
name (VARCHAR)
type (ENUM: fixed, moveable)
is_depreciable (BOOLEAN)
useful_life_years (INT)
depreciation_method (ENUM: straight_line, declining_balance)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Rules:**
- Umur ekonomis opsional
- Digunakan oleh modul asset
- Tidak boleh dihapus jika ada asset

### 4.2 Master Lokasi Asset

**Tabel:** `asset_locations`

**Fungsi:**
- Menentukan lokasi fisik asset
- Digunakan pada mutasi asset
- Tracking keberadaan asset

**Fields:**
```
id (UUID, PK)
code (VARCHAR, UNIQUE)
building (VARCHAR)
floor (VARCHAR)
room_name (VARCHAR)
pic_name (VARCHAR)
pic_phone (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Rules:**
- Kode lokasi harus unik
- PIC (Person In Charge) adalah nama, bukan user_id

### 4.3 Master Vendor

**Tabel:** `vendors`

**Fungsi:**
- Manajemen vendor/supplier
- Digunakan maintenance & procurement
- Tracking vendor information

**Fields:**
```
id (UUID, PK)
code (VARCHAR, UNIQUE)
name (VARCHAR)
service_type (VARCHAR)
contact_person (VARCHAR)
phone (VARCHAR)
email (VARCHAR)
address (TEXT)
rating (DECIMAL 1-5)
status (ENUM: active, inactive)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 5. ASSET MANAGEMENT

### 5.1 Asset Registry

**Tabel:** `assets`

**Fungsi Utama:**
- Registrasi asset
- Assign kategori, lokasi, vendor
- Pencatatan nilai perolehan
- Tracking status asset

**Fields:**
```
id (UUID, PK)
asset_code (VARCHAR, UNIQUE)
name (VARCHAR)
category_id (UUID, FK → asset_categories)
location_id (UUID, FK → asset_locations)
vendor_id (UUID, FK → vendors, NULLABLE)
serial_number (VARCHAR)
purchase_date (DATE)
acquisition_cost (DECIMAL)
residual_value (DECIMAL)
useful_life_years (INT)
depreciation_method (VARCHAR)
account_code (VARCHAR)
condition (ENUM: excellent, good, fair, poor)
status (ENUM: active, in_maintenance, disposed)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Status Asset:**
- **Active** - Asset dalam penggunaan normal
- **In Maintenance** - Asset sedang diperbaiki
- **Disposed** - Asset sudah dihapuskan

**Rules:**
- Asset code harus unik
- Tidak boleh ada asset tanpa kategori
- Vendor opsional (untuk internal asset)

---

## 6. MAINTENANCE MANAGEMENT

### 6.1 Maintenance Types

**Tabel:** `maintenance_types`

**Fungsi:**
- Definisi jenis maintenance
- SLA dan estimasi biaya
- Kategorisasi maintenance

**Fields:**
```
id (UUID, PK)
code (VARCHAR, UNIQUE)
name (VARCHAR)
description (TEXT)
sla_hours (INT)
estimated_cost (DECIMAL)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### 6.2 Maintenance Schedule

**Tabel:** `maintenance_schedules`

**Fungsi:**
- Penjadwalan maintenance asset
- Otomatis generate jadwal berikutnya
- Tracking maintenance history

**Fields:**
```
id (UUID, PK)
asset_id (UUID, FK → assets)
maintenance_type_id (UUID, FK → maintenance_types)
interval_type (ENUM: daily, weekly, monthly, quarterly, yearly)
last_date (DATE)
next_due_date (DATE)
assigned_vendor_id (UUID, FK → vendors)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### 6.3 Log Book

**Tabel:** `log_books`

**Fungsi:**
- Mencatat semua aktivitas asset
- Incident & inspection log
- Audit trail lengkap

**Fields:**
```
id (UUID, PK)
asset_id (UUID, FK → assets)
activity_type (ENUM: maintenance, inspection, incident, repair)
severity (ENUM: low, medium, high, critical)
description (TEXT)
user_id (UUID, FK → users)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 7. ASSET MUTATIONS & DISPOSALS

### 7.1 Asset Mutations

**Tabel:** `asset_mutations`

**Fungsi:**
- Tracking perpindahan asset
- Audit trail perubahan lokasi
- Approval workflow

**Fields:**
```
id (UUID, PK)
asset_id (UUID, FK → assets)
old_location_id (UUID, FK → asset_locations)
new_location_id (UUID, FK → asset_locations)
mutation_date (DATE)
reason (TEXT)
performed_by (UUID, FK → users)
approved_by (UUID, FK → users, NULLABLE)
status (ENUM: pending, approved, rejected)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### 7.2 Asset Disposals

**Tabel:** `asset_disposals`

**Fungsi:**
- Tracking penghapusan asset
- Approval workflow multi-level
- Validasi nilai disposal

**Fields:**
```
id (UUID, PK)
asset_id (UUID, FK → assets)
disposal_date (DATE)
disposal_type (ENUM: sold, scrapped, donated, lost)
sale_value (DECIMAL)
reason (TEXT)
requested_by (UUID, FK → users)
approved_by (UUID, FK → users)
finance_approved_by (UUID, FK → users)
status (ENUM: pending, approved, rejected, completed)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Workflow:**
1. GA mengajukan disposal
2. Manager melakukan approval
3. Finance validasi nilai
4. Admin execute disposal
5. Asset status = Disposed

---

## 8. SPAREPART MANAGEMENT

**Tabel:** `spareparts`

**Fungsi:**
- Monitoring stok sparepart
- Alert minimum stok
- Vendor tracking

**Fields:**
```
id (UUID, PK)
code (VARCHAR, UNIQUE)
name (VARCHAR)
category (VARCHAR)
stock_qty (INT)
min_stock (INT)
unit (VARCHAR)
vendor_id (UUID, FK → vendors)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 9. ATK (STATIONERY) MANAGEMENT

**Tabel:** `atk_items`, `atk_requests`, `atk_request_items`

**Workflow:**
1. Employee membuat request
2. GA/Manager approval
3. Stock update
4. Request closed

**Fields ATK Items:**
```
id (UUID, PK)
name (VARCHAR)
category (VARCHAR)
stock_qty (INT)
min_stock (INT)
unit (VARCHAR)
```

**Fields ATK Requests:**
```
id (UUID, PK)
requester_id (UUID, FK → users)
request_date (DATE)
status (ENUM: pending, approved, rejected, completed)
approved_by (UUID, FK → users)
approval_date (DATE)
```

---

## 10. ROOMS & WORKSPACE

**Tabel:** `rooms`, `room_assets`

**Fungsi:**
- Manajemen ruang kantor
- Asset dalam ruangan
- Booking & availability

**Fields Rooms:**
```
id (UUID, PK)
name (VARCHAR)
type (ENUM: office, meeting, storage, etc)
floor (INT)
capacity (INT)
status (ENUM: available, occupied, maintenance)
```

---

## 11. CONTRACT MANAGEMENT

**Tabel:** `contracts`

**Fungsi:**
- Kontrak vendor / karyawan
- Reminder expired
- Tracking kontrak

**Fields:**
```
id (UUID, PK)
code (VARCHAR, UNIQUE)
title (VARCHAR)
party_name (VARCHAR)
type (ENUM: vendor, employee, service)
start_date (DATE)
end_date (DATE)
value (DECIMAL)
status (ENUM: active, expired, terminated)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 12. TIMESHEET & CREDIT CARD

### 12.1 Timesheet

**Tabel:** `timesheets`

**Fungsi:**
- Laporan aktivitas harian vendor
- Tracking jam kerja

### 12.2 Credit Card

**Tabel:** `credit_cards`

**Fungsi:**
- Monitoring penggunaan kartu kredit perusahaan
- Tracking transaksi

---

## 13. PROJECT MANAGEMENT

**Tabel:** `projects`

**Fungsi:**
- Monitoring progres proyek
- Tracking budget & timeline

---

## 14. LEAVE MANAGEMENT

**Tabel:** `leave_requests`

**Workflow:**
1. Employee membuat request
2. Manager approval
3. HR validation
4. Leave recorded

---

**Document Version:** 1.0  
**Last Updated:** December 9, 2025  
**Status:** Ready for Implementation
