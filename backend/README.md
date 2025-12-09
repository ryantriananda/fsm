# FSM Backend API

Backend API untuk Facility & Asset Management System menggunakan Go dan PostgreSQL.

## Setup

### Prerequisites
- Go 1.21+
- PostgreSQL 12+

### Installation

1. Install dependencies:
```bash
go mod download
```

2. Setup Database:
```bash
# Create database
createdb fsm_db

# Run schema
psql fsm_db < schema.sql
```

3. Set environment variable (optional):
```bash
export DATABASE_URL="postgres://username:password@localhost/fsm_db?sslmode=disable"
```

4. Run server:
```bash
go run main.go
```

Server akan berjalan di `http://localhost:8080`

## API Endpoints

### Asset Categories
- `GET /api/asset-categories` - Get all categories
- `POST /api/asset-categories` - Create category
- `PUT /api/asset-categories/{id}` - Update category
- `DELETE /api/asset-categories/{id}` - Delete category

### Asset Locations
- `GET /api/asset-locations` - Get all locations
- `POST /api/asset-locations` - Create location
- `PUT /api/asset-locations/{id}` - Update location
- `DELETE /api/asset-locations/{id}` - Delete location

### Asset Status
- `GET /api/asset-statuses` - Get all statuses
- `POST /api/asset-statuses` - Create status
- `PUT /api/asset-statuses/{id}` - Update status
- `DELETE /api/asset-statuses/{id}` - Delete status

### Assets
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create asset
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset

### Vendors
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/{id}` - Update vendor
- `DELETE /api/vendors/{id}` - Delete vendor

### Contracts
- `GET /api/contracts` - Get all contracts
- `POST /api/contracts` - Create contract
- `PUT /api/contracts/{id}` - Update contract
- `DELETE /api/contracts/{id}` - Delete contract

## Example Request

```bash
curl -X POST http://localhost:8080/api/asset-categories \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CAT-001",
    "name": "Electronics",
    "type": "Moveable",
    "depreciation": "Yes",
    "life": 4
  }'
```

## Response Format

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error message"
}
```
