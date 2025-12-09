# Asset Integration - Recommended Fixes

## 🔧 Database Schema Improvements

### Issue 1: Missing Contract-Asset Relationship

**Current Problem:**
```sql
-- Contracts table has no link to assets
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50),
    title VARCHAR(255),
    party_name VARCHAR(255),
    -- ❌ No asset_id field
);
```

**Fix:**
```sql
ALTER TABLE contracts ADD COLUMN asset_id INT REFERENCES assets(id);
```

**Impact:**
- Can track which contracts relate to which assets
- Better audit trail
- Enables contract-based asset queries

---

### Issue 2: Weak Maintenance Type Reference

**Current Problem:**
```sql
-- maintenance_schedules.type is just a string
CREATE TABLE maintenance_schedules (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id),
    type VARCHAR(100),  -- ❌ String, not FK
    vendor_id INT REFERENCES vendors(id),
);
```

**Fix:**
```sql
-- Step 1: Add new column
ALTER TABLE maintenance_schedules 
ADD COLUMN maintenance_type_id INT REFERENCES maintenance_types(id);

-- Step 2: Migrate data (map string to ID)
UPDATE maintenance_schedules m
SET maintenance_type_id = mt.id
FROM maintenance_types mt
WHERE m.type = mt.name;

-- Step 3: Drop old column
ALTER TABLE maintenance_schedules DROP COLUMN type;
```

**Impact:**
- Data integrity enforcement
- Prevents invalid maintenance types
- Better query performance

---

### Issue 3: Missing Vendor in Assets

**Current Problem:**
```sql
-- Assets don't have direct vendor reference
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50),
    name VARCHAR(255),
    category_id INT REFERENCES asset_categories(id),
    location_id INT REFERENCES asset_locations(id),
    status_id INT REFERENCES asset_statuses(id),
    -- ❌ No vendor_id field
);
```

**Fix:**
```sql
ALTER TABLE assets ADD COLUMN vendor_id INT REFERENCES vendors(id);
```

**Impact:**
- Track asset supplier/vendor
- Better vendor management
- Enables vendor-based asset queries

---

### Issue 4: Missing Asset Reference in Spareparts

**Current Problem:**
```sql
-- Spareparts not linked to specific assets
CREATE TABLE spareparts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50),
    name VARCHAR(255),
    category VARCHAR(100),
    stock INT,
    vendor_id INT REFERENCES vendors(id),
    -- ❌ No asset_id field
);
```

**Fix:**
```sql
ALTER TABLE spareparts ADD COLUMN asset_id INT REFERENCES assets(id);
```

**Impact:**
- Track which spareparts are for which assets
- Better inventory management
- Enables asset-based sparepart queries

---

### Issue 5: ARK Not Linked to Assets

**Current Problem:**
```sql
-- ARK is separate table, not linked to assets
CREATE TABLE ark (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50),
    name VARCHAR(255),
    category VARCHAR(100),
    quantity INT,
    location_id INT REFERENCES asset_locations(id),
    -- ❌ No asset_id field
);
```

**Fix Option 1: Link ARK to Assets**
```sql
ALTER TABLE ark ADD COLUMN asset_id INT REFERENCES assets(id);
```

**Fix Option 2: Consolidate into Assets**
```sql
-- Add ARK-specific fields to assets
ALTER TABLE assets ADD COLUMN quantity INT;
ALTER TABLE assets ADD COLUMN condition VARCHAR(50);
ALTER TABLE assets ADD COLUMN asset_type VARCHAR(50); -- 'asset', 'atk', 'ark'
```

**Recommendation:** Option 1 (Link ARK to Assets) - Less disruptive

---

## 🔌 Backend API Improvements

### Missing Endpoints

#### 1. Maintenance Schedules API
```go
// Add to main.go routes
router.HandleFunc("/api/maintenance-schedules", getMaintenanceSchedules).Methods("GET")
router.HandleFunc("/api/maintenance-schedules", createMaintenanceSchedule).Methods("POST")
router.HandleFunc("/api/maintenance-schedules/{id}", updateMaintenanceSchedule).Methods("PUT")
router.HandleFunc("/api/maintenance-schedules/{id}", deleteMaintenanceSchedule).Methods("DELETE")

// Handler functions
func getMaintenanceSchedules(w http.ResponseWriter, r *http.Request) {
    rows, err := db.Query(`
        SELECT ms.id, ms.asset_id, ms.maintenance_type_id, ms.interval, 
               ms.last_date, ms.next_date, ms.vendor_id, ms.created_at, ms.updated_at
        FROM maintenance_schedules ms
    `)
    // ... implementation
}

func createMaintenanceSchedule(w http.ResponseWriter, r *http.Request) {
    var schedule MaintenanceSchedule
    json.NewDecoder(r.Body).Decode(&schedule)
    
    err := db.QueryRow(`
        INSERT INTO maintenance_schedules 
        (asset_id, maintenance_type_id, interval, last_date, next_date, vendor_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, created_at, updated_at
    `, schedule.AssetID, schedule.MaintenanceTypeID, schedule.Interval,
       schedule.LastDate, schedule.NextDate, schedule.VendorID).
        Scan(&schedule.ID, &schedule.CreatedAt, &schedule.UpdatedAt)
    
    respondSuccess(w, schedule)
}
```

#### 2. Disposals API
```go
router.HandleFunc("/api/disposals", getDisposals).Methods("GET")
router.HandleFunc("/api/disposals", createDisposal).Methods("POST")
router.HandleFunc("/api/disposals/{id}", updateDisposal).Methods("PUT")
router.HandleFunc("/api/disposals/{id}", deleteDisposal).Methods("DELETE")
```

#### 3. Asset Documents API
```go
router.HandleFunc("/api/asset-documents", getAssetDocuments).Methods("GET")
router.HandleFunc("/api/asset-documents", createAssetDocument).Methods("POST")
router.HandleFunc("/api/asset-documents/{id}", updateAssetDocument).Methods("PUT")
router.HandleFunc("/api/asset-documents/{id}", deleteAssetDocument).Methods("DELETE")
```

#### 4. Spareparts API
```go
router.HandleFunc("/api/spareparts", getSpareparts).Methods("GET")
router.HandleFunc("/api/spareparts", createSparepart).Methods("POST")
router.HandleFunc("/api/spareparts/{id}", updateSparepart).Methods("PUT")
router.HandleFunc("/api/spareparts/{id}", deleteSparepart).Methods("DELETE")
```

---

## 🎨 Frontend Integration Improvements

### 1. Update Asset Form

**Current:**
```tsx
<MasterCRUD 
    title="Asset Management"
    fields={[
        { name: 'code', label: 'Asset Code', type: 'text' },
        { name: 'name', label: 'Asset Name', type: 'text' },
        { name: 'category_id', label: 'Category', type: 'select' },
        { name: 'location_id', label: 'Location', type: 'select' },
        { name: 'status_id', label: 'Status', type: 'select' },
        // ❌ Missing vendor_id
    ]}
/>
```

**Improved:**
```tsx
<MasterCRUD 
    title="Asset Management"
    fields={[
        { name: 'code', label: 'Asset Code', type: 'text', required: true },
        { name: 'name', label: 'Asset Name', type: 'text', required: true },
        { name: 'category_id', label: 'Category', type: 'select', required: true },
        { name: 'location_id', label: 'Location', type: 'select', required: true },
        { name: 'status_id', label: 'Status', type: 'select', required: true },
        { name: 'vendor_id', label: 'Vendor/Supplier', type: 'select' }, // ✅ Added
        { name: 'acquisition_cost', label: 'Acquisition Cost', type: 'number' },
        { name: 'depreciation_method', label: 'Depreciation Method', type: 'select' },
    ]}
/>
```

### 2. Add API Services

**services/assetIntegrationService.ts:**
```typescript
export const maintenanceScheduleAPI = {
    getAll: async () => {
        const res = await fetch(`${API_BASE_URL}/maintenance-schedules`);
        return res.json();
    },
    create: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/maintenance-schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    // ... update, delete
};

export const disposalAPI = {
    getAll: async () => { /* ... */ },
    create: async (data: any) => { /* ... */ },
    // ... update, delete
};

export const assetDocumentAPI = {
    getAll: async () => { /* ... */ },
    create: async (data: any) => { /* ... */ },
    // ... update, delete
};

export const sparepartAPI = {
    getAll: async () => { /* ... */ },
    create: async (data: any) => { /* ... */ },
    // ... update, delete
};
```

### 3. Update App.tsx

```tsx
import { maintenanceScheduleAPI, disposalAPI, assetDocumentAPI, sparepartAPI } from './services/assetIntegrationService';

// In renderContent():
case 'maintenance-schedule':
    return (
        <MasterCRUD 
            title="Jadwal Maintenance"
            apiService={maintenanceScheduleAPI}
            columns={[...]}
            fields={[...]}
        />
    );

case 'disposal':
    return (
        <MasterCRUD 
            title="Disposal & Mutasi"
            apiService={disposalAPI}
            columns={[...]}
            fields={[...]}
        />
    );

case 'asset-docs':
    return (
        <MasterCRUD 
            title="Dokumen Asset"
            apiService={assetDocumentAPI}
            columns={[...]}
            fields={[...]}
        />
    );

case 'sparepart':
    return (
        <MasterCRUD 
            title="Sparepart"
            apiService={sparepartAPI}
            columns={[...]}
            fields={[...]}
        />
    );
```

---

## 📋 Implementation Plan

### Phase 1: Database (1-2 hours)
1. Add asset_id to contracts
2. Fix maintenance_schedules type reference
3. Add vendor_id to assets
4. Add asset_id to spareparts
5. Add asset_id to ark (optional)

### Phase 2: Backend API (3-4 hours)
1. Implement maintenance schedules endpoints
2. Implement disposals endpoints
3. Implement asset documents endpoints
4. Implement spareparts endpoints
5. Update asset endpoints

### Phase 3: Frontend (4-5 hours)
1. Create API services
2. Update asset form
3. Add maintenance schedule UI
4. Add disposal UI
5. Add document UI
6. Add sparepart UI

### Phase 4: Testing (2-3 hours)
1. Test all CRUD operations
2. Test relationships
3. Test data integrity
4. Test error handling

---

## 🎯 Priority Matrix

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Add asset_id to contracts | High | 0.5h | High |
| Fix maintenance type FK | High | 1h | High |
| Add vendor_id to assets | High | 0.5h | High |
| Implement maintenance API | High | 2h | High |
| Implement disposal API | Medium | 1.5h | Medium |
| Implement document API | Medium | 1.5h | Medium |
| Implement sparepart API | Medium | 1.5h | Medium |
| Update frontend forms | Medium | 2h | Medium |

---

## ✅ Verification Checklist

After implementing fixes:

- [ ] Database schema updated
- [ ] All foreign keys in place
- [ ] API endpoints implemented
- [ ] API endpoints tested
- [ ] Frontend forms updated
- [ ] Frontend integration working
- [ ] Data validation working
- [ ] Error handling working
- [ ] All CRUD operations working
- [ ] Relationships verified

---

## 📊 Expected Outcome

**Before:**
- Asset core: 100%
- Asset relationships: 50%
- API coverage: 50%
- Frontend integration: 50%
- **Overall: 60%**

**After:**
- Asset core: 100%
- Asset relationships: 100%
- API coverage: 100%
- Frontend integration: 100%
- **Overall: 100%**

---

**Recommendation:** Implement all fixes to achieve complete asset integration.

**Estimated Total Time:** 10-14 hours

**Priority:** High - These are critical for proper asset management

---

**Last Updated:** December 9, 2025
