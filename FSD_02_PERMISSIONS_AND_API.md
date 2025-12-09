# FSD Part 2: Permission Matrix & API Specification

---

## 1. PERMISSION MATRIX (Role × Action)

Permissions are defined per menu/resource. 

**Actions:**
- C = Create
- R = Read
- U = Update
- D = Delete
- A = Approve
- E = Export

### 1.1 Permission Matrix Table

| Menu / Resource | Admin | GA | HR | Finance | Manager | Employee |
|-----------------|-------|----|----|---------|---------|----------|
| **Departments** | C R U D E | R | R | R | R | - |
| **Users** | C R U D E | R | C R U | R | R | - |
| **Employees** | C R U D E | R | C R U | R | R | - |
| **Asset Categories** | C R U D E | R | - | R | R | - |
| **Asset Locations** | C R U D E | C R U | - | R | R | - |
| **Vendors** | C R U D E | C R U | - | R | R | - |
| **Assets** | C R U D E | C R U | - | R | R | R |
| **Asset Documents** | C R U D E | C R U | - | R | R | R |
| **Asset Mutations** | C R U D E | C R U A | - | R | A | R |
| **Asset Disposals** | C R U D E | C R U | - | A | A | - |
| **Maintenance Types** | C R U D E | C R U | - | R | R | - |
| **Maintenance Schedules** | C R U D E | C R U | - | R | R | - |
| **Spareparts** | C R U D E | C R U | - | R | R | - |
| **Log Book** | C R U D E | C R U | - | R | R | C R |
| **ATK Items** | C R U D E | C R U | - | R | R | - |
| **ATK Requests** | C R U D E | C R U A | - | R | A | C R U |
| **Rooms** | C R U D E | C R U | - | R | R | - |
| **Contracts** | C R U D E | C R U | - | R | A | - |
| **Timesheets** | C R U D E | C R U | - | R | R | C R U |
| **Credit Cards** | C R U D E | R | - | C R U | R | - |
| **Projects** | C R U D E | C R U | - | R | A | R |
| **Leave Requests** | C R U D E | R | C R U | - | A | C R U |

**Catatan:**
- "A" (Approve) berarti peran dapat melakukan approval pada alur khusus
- "-" berarti tidak ada akses
- Admin memiliki akses penuh ke semua resource

---

## 2. API SPECIFICATION

Semua endpoint menggunakan base path: `/api/v1`

**Autentikasi:** Bearer JWT token

### 2.1 Authentication Endpoints

#### POST /auth/login
**Request:**
```json
{
  "email": "user@company.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@company.com",
    "full_name": "John Doe",
    "role": "admin",
    "department": "IT"
  }
}
```

#### POST /auth/logout
**Request:** (header bearer)

**Response (200):**
```json
{
  "ok": true,
  "message": "Logged out successfully"
}
```

#### POST /auth/refresh
**Request:** (header bearer)

**Response (200):**
```json
{
  "access_token": "new_token",
  "expires_in": 3600
}
```

---

### 2.2 Departments Endpoints

#### GET /departments
**Query Parameters:**
- `page` (default: 1)
- `per_page` (default: 25)
- `search` (optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "IT",
      "name": "Information Technology",
      "description": "IT Department",
      "created_at": "2025-12-09T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 25,
    "total": 100
  }
}
```

#### POST /departments
**Request:**
```json
{
  "code": "IT",
  "name": "Information Technology",
  "description": "IT Department"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "code": "IT",
    "name": "Information Technology",
    "created_at": "2025-12-09T10:00:00Z"
  }
}
```

#### GET /departments/{id}
**Response (200):** Single department object

#### PUT /departments/{id}
**Request:** Same as POST

**Response (200):** Updated department object

#### DELETE /departments/{id}
**Response (204):** No content

---

### 2.3 Users Endpoints

#### GET /users
**Query Parameters:**
- `page`, `per_page`
- `role` (filter by role)
- `department_id` (filter by department)
- `status` (active, inactive, suspended)

**Response (200):** List of users with pagination

#### POST /users
**Request:**
```json
{
  "email": "john@company.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "role": "ga",
  "department_id": "uuid",
  "status": "active"
}
```

**Response (201):** Created user object

#### GET /users/{id}
**Response (200):** Single user object

#### PUT /users/{id}
**Request:** Partial update allowed

**Response (200):** Updated user object

#### DELETE /users/{id}
**Response (204):** No content (soft delete)

---

### 2.4 Assets Endpoints

#### GET /assets
**Query Parameters:**
- `page`, `per_page`
- `category_id` (filter)
- `location_id` (filter)
- `status` (filter)
- `q` (search by name/code)
- `sort` (e.g., `created_at:desc`)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "asset_code": "AST-001",
      "name": "MacBook Pro",
      "category": "Electronics",
      "location": "Office - Floor 2",
      "status": "active",
      "condition": "good",
      "purchase_date": "2023-01-15",
      "acquisition_cost": 2500.00,
      "created_at": "2025-12-09T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "per_page": 25, "total": 150 }
}
```

#### POST /assets
**Request:**
```json
{
  "asset_code": "AST-001",
  "name": "MacBook Pro",
  "category_id": "uuid",
  "location_id": "uuid",
  "vendor_id": "uuid",
  "serial_number": "SN123456",
  "purchase_date": "2023-01-15",
  "acquisition_cost": 2500.00,
  "residual_value": 200.00,
  "useful_life_years": 4,
  "depreciation_method": "straight_line",
  "account_code": "1010-001",
  "condition": "good"
}
```

**Response (201):** Created asset object

#### GET /assets/{id}
**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "asset_code": "AST-001",
    "name": "MacBook Pro",
    "category": { "id": "uuid", "name": "Electronics" },
    "location": { "id": "uuid", "name": "Office - Floor 2" },
    "vendor": { "id": "uuid", "name": "Apple Inc" },
    "status": "active",
    "condition": "good",
    "purchase_date": "2023-01-15",
    "acquisition_cost": 2500.00,
    "residual_value": 200.00,
    "useful_life_years": 4,
    "depreciation_method": "straight_line",
    "book_value": 1875.00,
    "depreciation_schedule": [
      { "month": "2023-02", "depreciation": 52.08, "book_value": 2447.92 }
    ],
    "documents": [],
    "mutations": [],
    "maintenance_schedules": [],
    "created_at": "2025-12-09T10:00:00Z"
  }
}
```

#### PUT /assets/{id}
**Request:** Partial update

**Response (200):** Updated asset object

#### DELETE /assets/{id}
**Response (204):** No content (soft delete)

---

### 2.5 Asset Documents Endpoints

#### POST /assets/{asset_id}/documents
**Request:** multipart/form-data
```
doc_type: "warranty"
doc_number: "WAR-123456"
issue_date: "2023-01-15"
expiry_date: "2025-01-15"
file: <binary>
```

**Response (201):** Created document object

#### GET /assets/{asset_id}/documents
**Response (200):** List of documents for asset

#### DELETE /assets/{asset_id}/documents/{doc_id}
**Response (204):** No content

---

### 2.6 Asset Mutations Endpoints

#### POST /assets/{asset_id}/mutations
**Request:**
```json
{
  "new_location_id": "uuid",
  "mutation_date": "2025-12-09",
  "reason": "Relocation to new office"
}
```

**Response (201):** Created mutation object

#### GET /assets/{asset_id}/mutations
**Response (200):** List of mutations for asset

#### PUT /assets/{asset_id}/mutations/{mutation_id}/approve
**Request:**
```json
{
  "approved_by": "uuid",
  "status": "approved"
}
```

**Response (200):** Updated mutation object

---

### 2.7 Asset Disposals Endpoints

#### POST /assets/{asset_id}/disposals
**Request:**
```json
{
  "disposal_date": "2025-12-09",
  "disposal_type": "sold",
  "sale_value": 500.00,
  "reason": "End of life"
}
```

**Response (201):** Created disposal object

#### GET /assets/{asset_id}/disposals
**Response (200):** List of disposals for asset

#### PUT /assets/{asset_id}/disposals/{disposal_id}/approve
**Request:**
```json
{
  "approved_by": "uuid",
  "status": "approved"
}
```

**Response (200):** Updated disposal object

---

### 2.8 Maintenance Endpoints

#### GET /maintenance/schedules
**Query Parameters:**
- `page`, `per_page`
- `asset_id` (filter)
- `status` (pending, completed, overdue)

**Response (200):** List of maintenance schedules

#### POST /maintenance/schedules
**Request:**
```json
{
  "asset_id": "uuid",
  "maintenance_type_id": "uuid",
  "interval_type": "monthly",
  "last_date": "2025-11-09",
  "next_due_date": "2025-12-09",
  "assigned_vendor_id": "uuid"
}
```

**Response (201):** Created schedule object

#### POST /maintenance/logs
**Request:**
```json
{
  "asset_id": "uuid",
  "activity_type": "maintenance",
  "severity": "medium",
  "description": "Regular maintenance performed",
  "user_id": "uuid"
}
```

**Response (201):** Created log object

#### GET /maintenance/logs
**Query Parameters:**
- `asset_id` (filter)
- `activity_type` (filter)

**Response (200):** List of maintenance logs

---

### 2.9 ATK Endpoints

#### GET /atk/items
**Response (200):** List of ATK items

#### POST /atk/requests
**Request:**
```json
{
  "requester_id": "uuid",
  "items": [
    { "item_id": "uuid", "quantity": 10 },
    { "item_id": "uuid", "quantity": 5 }
  ]
}
```

**Response (201):** Created request object

#### PUT /atk/requests/{id}/approve
**Request:**
```json
{
  "approved_by": "uuid",
  "status": "approved"
}
```

**Response (200):** Updated request object

#### PUT /atk/requests/{id}/reject
**Request:**
```json
{
  "rejected_by": "uuid",
  "reason": "Budget exceeded"
}
```

**Response (200):** Updated request object

---

### 2.10 Generic API Notes

**Pagination:**
```
?page=1&per_page=25
```

**Sorting:**
```
?sort=created_at:desc
?sort=name:asc
```

**Filtering:**
```
?field=value
?status=active&category_id=uuid
```

**Response Envelope:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "per_page": 25,
    "total": 123,
    "total_pages": 5
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Email is required" }
    ]
  }
}
```

**HTTP Status Codes:**
- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error

---

## 3. AUTHENTICATION & SECURITY

### 3.1 JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "user_id",
  "email": "user@company.com",
  "role": "admin",
  "department_id": "uuid",
  "iat": 1702200000,
  "exp": 1702203600
}
```

### 3.2 Security Requirements

- ✅ Password hashing (bcrypt)
- ✅ RBAC enforcement
- ✅ UUID Primary Keys
- ✅ HTTPS only (production)
- ✅ CORS properly configured
- ✅ Rate limiting on auth endpoints
- ✅ Audit logging for sensitive operations

---

## 4. ERROR HANDLING

### 4.1 Standard Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| INTERNAL_ERROR | 500 | Server error |

### 4.2 Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

---

**Document Version:** 1.0  
**Last Updated:** December 9, 2025  
**Status:** Ready for Implementation
