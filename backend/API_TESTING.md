# API Testing Guide

## Base URL
```
http://localhost:8080/api
```

## Health Check
```bash
GET /health
```

Response:
```json
{
  "success": true,
  "message": "OK"
}
```

---

## Asset Categories

### List All Categories
```bash
GET /asset-categories
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "CAT-001",
      "name": "Electronics",
      "type": "Moveable",
      "depreciation": "Yes",
      "life": 4,
      "created_at": "2025-12-09T10:00:00Z",
      "updated_at": "2025-12-09T10:00:00Z"
    }
  ]
}
```

### Create Category
```bash
POST /asset-categories
Content-Type: application/json

{
  "code": "CAT-001",
  "name": "Electronics",
  "type": "Moveable",
  "depreciation": "Yes",
  "life": 4
}
```

### Update Category
```bash
PUT /asset-categories/1
Content-Type: application/json

{
  "code": "CAT-001",
  "name": "Electronics Updated",
  "type": "Moveable",
  "depreciation": "Yes",
  "life": 5
}
```

### Delete Category
```bash
DELETE /asset-categories/1
```

---

## Asset Locations

### List All Locations
```bash
GET /asset-locations
```

### Create Location
```bash
POST /asset-locations
Content-Type: application/json

{
  "code": "HQ-L2-01",
  "building": "Headquarters",
  "floor": "2nd Floor",
  "room": "Server Room",
  "pic": "IT Admin"
}
```

### Update Location
```bash
PUT /asset-locations/1
Content-Type: application/json

{
  "code": "HQ-L2-01",
  "building": "Headquarters",
  "floor": "2nd Floor",
  "room": "Server Room Updated",
  "pic": "IT Manager"
}
```

### Delete Location
```bash
DELETE /asset-locations/1
```

---

## Asset Status

### List All Statuses
```bash
GET /asset-statuses
```

### Create Status
```bash
POST /asset-statuses
Content-Type: application/json

{
  "code": "ACT",
  "name": "Active",
  "description": "Asset is in use",
  "is_active": "Yes"
}
```

### Update Status
```bash
PUT /asset-statuses/1
Content-Type: application/json

{
  "code": "ACT",
  "name": "Active",
  "description": "Asset is actively in use",
  "is_active": "Yes"
}
```

### Delete Status
```bash
DELETE /asset-statuses/1
```

---

## Assets

### List All Assets
```bash
GET /assets
```

### Create Asset
```bash
POST /assets
Content-Type: application/json

{
  "code": "AST-001",
  "name": "MacBook Pro M2",
  "category_id": 1,
  "location_id": 1,
  "status_id": 1,
  "acquisition_cost": 2500.00,
  "residual_value": 200.00,
  "useful_life": 4,
  "depreciation_method": "Straight Line",
  "book_value": 1875.00
}
```

### Update Asset
```bash
PUT /assets/1
Content-Type: application/json

{
  "code": "AST-001",
  "name": "MacBook Pro M2 Updated",
  "category_id": 1,
  "location_id": 1,
  "status_id": 1,
  "acquisition_cost": 2500.00,
  "residual_value": 200.00,
  "useful_life": 4,
  "depreciation_method": "Straight Line",
  "book_value": 1875.00
}
```

### Delete Asset
```bash
DELETE /assets/1
```

---

## Vendors

### List All Vendors
```bash
GET /vendors
```

### Create Vendor
```bash
POST /vendors
Content-Type: application/json

{
  "code": "VND-001",
  "name": "PT Supplier Indonesia",
  "contact_person": "John Doe",
  "email": "john@supplier.com",
  "phone": "+62-21-1234567",
  "address": "Jl. Merdeka No. 123",
  "city": "Jakarta",
  "country": "Indonesia"
}
```

### Update Vendor
```bash
PUT /vendors/1
Content-Type: application/json

{
  "code": "VND-001",
  "name": "PT Supplier Indonesia Updated",
  "contact_person": "Jane Doe",
  "email": "jane@supplier.com",
  "phone": "+62-21-7654321",
  "address": "Jl. Sudirman No. 456",
  "city": "Jakarta",
  "country": "Indonesia"
}
```

### Delete Vendor
```bash
DELETE /vendors/1
```

---

## Contracts

### List All Contracts
```bash
GET /contracts
```

### Create Contract
```bash
POST /contracts
Content-Type: application/json

{
  "code": "CTR-001",
  "title": "Software Engineer Agreement",
  "party_name": "John Doe",
  "type": "PKWT",
  "start_date": "2023-01-01",
  "end_date": "2024-01-01",
  "status": "Active",
  "value": 12000.00
}
```

### Update Contract
```bash
PUT /contracts/1
Content-Type: application/json

{
  "code": "CTR-001",
  "title": "Software Engineer Agreement Updated",
  "party_name": "John Doe",
  "type": "PKWT",
  "start_date": "2023-01-01",
  "end_date": "2024-06-01",
  "status": "Active",
  "value": 15000.00
}
```

### Delete Contract
```bash
DELETE /contracts/1
```

---

## Testing with cURL

### Create and Test Full Workflow

```bash
# 1. Create Category
curl -X POST http://localhost:8080/api/asset-categories \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST-CAT",
    "name": "Test Category",
    "type": "Moveable",
    "depreciation": "Yes",
    "life": 5
  }'

# 2. Get All Categories
curl http://localhost:8080/api/asset-categories

# 3. Update Category (replace ID with actual ID)
curl -X PUT http://localhost:8080/api/asset-categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST-CAT",
    "name": "Test Category Updated",
    "type": "Fix",
    "depreciation": "No",
    "life": 10
  }'

# 4. Delete Category
curl -X DELETE http://localhost:8080/api/asset-categories/1
```

---

## Testing with Postman

1. Import collection from this file
2. Set base URL: `http://localhost:8080/api`
3. Run requests in order
4. Check responses

---

## Testing with Insomnia

1. Create new workspace
2. Add requests from this file
3. Set base URL environment variable
4. Run requests

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Tips

1. Always include `Content-Type: application/json` header for POST/PUT
2. Use proper date format: `YYYY-MM-DD`
3. Use decimal format for money: `1000.00`
4. Check response status code
5. Verify data in database after operations

---

## Troubleshooting

### Connection Refused
- Check backend is running: `go run main.go`
- Check port 8080 is available

### Invalid JSON
- Check JSON syntax
- Use proper quotes
- Validate with JSON validator

### Database Error
- Check database is running
- Check schema is imported
- Check connection string

### CORS Error
- CORS is enabled by default
- Check browser console for details

---

**Last Updated:** December 2025
