# FSM (Facility & Asset Management) - Setup Guide

## Project Structure

```
fsm/
├── backend/              # Go API Server
│   ├── main.go          # Main server file
│   ├── schema.sql       # Database schema
│   ├── go.mod           # Go dependencies
│   └── README.md        # Backend documentation
├── components/          # React components
├── services/            # API services
│   ├── apiService.ts    # API client
│   └── geminiService.ts # Gemini AI service
├── App.tsx              # Main app component
├── index.tsx            # React entry point
└── package.json         # Frontend dependencies
```

## Prerequisites

- Node.js 18+
- Go 1.21+
- PostgreSQL 12+

## Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Download Go dependencies:
```bash
go mod download
```

3. Create PostgreSQL database:
```bash
createdb fsm_db
```

4. Import schema:
```bash
psql fsm_db < schema.sql
```

5. Run server:
```bash
go run main.go
```

Backend akan berjalan di `http://localhost:8080`

## Database Configuration

Default connection string:
```
postgres://postgres:postgres@localhost/fsm_db?sslmode=disable
```

Untuk custom configuration, set environment variable:
```bash
export DATABASE_URL="postgres://user:password@host/dbname?sslmode=disable"
```

## API Endpoints

### Master Data Management

#### Asset Categories
- `GET /api/asset-categories` - List all
- `POST /api/asset-categories` - Create
- `PUT /api/asset-categories/{id}` - Update
- `DELETE /api/asset-categories/{id}` - Delete

#### Asset Locations
- `GET /api/asset-locations` - List all
- `POST /api/asset-locations` - Create
- `PUT /api/asset-locations/{id}` - Update
- `DELETE /api/asset-locations/{id}` - Delete

#### Asset Status
- `GET /api/asset-statuses` - List all
- `POST /api/asset-statuses` - Create
- `PUT /api/asset-statuses/{id}` - Update
- `DELETE /api/asset-statuses/{id}` - Delete

#### Assets
- `GET /api/assets` - List all
- `POST /api/assets` - Create
- `PUT /api/assets/{id}` - Update
- `DELETE /api/assets/{id}` - Delete

#### Vendors
- `GET /api/vendors` - List all
- `POST /api/vendors` - Create
- `PUT /api/vendors/{id}` - Update
- `DELETE /api/vendors/{id}` - Delete

#### Contracts
- `GET /api/contracts` - List all
- `POST /api/contracts` - Create
- `PUT /api/contracts/{id}` - Update
- `DELETE /api/contracts/{id}` - Delete

## Features

### Master Asset Management
- Asset Categories
- Asset Locations
- Asset Status
- Asset List
- Asset Valuation & Depreciation
- Vendor Management
- Contract Management

### Operational Modules
- ATK (Office Supplies)
- ARK (Office Equipment)
- Timesheet
- Credit Card Management
- Log Book
- Project Management

### Maintenance Management
- Maintenance Schedules
- Maintenance Types
- Sparepart Inventory
- Asset Disposal & Mutation
- Asset Documents
- Role & Access Control

## Example API Calls

### Create Asset Category
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

### Get All Asset Categories
```bash
curl http://localhost:8080/api/asset-categories
```

### Update Asset Category
```bash
curl -X PUT http://localhost:8080/api/asset-categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CAT-001",
    "name": "Electronics Updated",
    "type": "Moveable",
    "depreciation": "Yes",
    "life": 5
  }'
```

### Delete Asset Category
```bash
curl -X DELETE http://localhost:8080/api/asset-categories/1
```

## Frontend Components

### MasterCRUD Component
Reusable CRUD component untuk master data management dengan fitur:
- List data dengan search
- Create/Edit/Delete operations
- Modal form
- API integration
- Local state management fallback

Usage:
```tsx
<MasterCRUD 
  title="Asset Categories"
  description="Manage asset classifications"
  tableName="asset_categories"
  columns={[...]}
  fields={[...]}
  apiService={assetCategoryAPI}
/>
```

## Troubleshooting

### Database Connection Error
- Pastikan PostgreSQL running
- Check DATABASE_URL environment variable
- Verify database exists: `psql -l`

### API Not Responding
- Check backend server running: `http://localhost:8080/api/health`
- Check CORS headers
- Verify database connection

### Frontend Not Loading
- Clear browser cache
- Check console for errors
- Verify npm dependencies installed

## Development

### Adding New Module

1. Create database table in `backend/schema.sql`
2. Add API handlers in `backend/main.go`
3. Create API service in `services/apiService.ts`
4. Create component or use MasterCRUD
5. Add route in `App.tsx`
6. Add menu item in `Sidebar.tsx`

### Code Style
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Go with standard library + gorilla/mux + lib/pq

## Production Deployment

### Backend
```bash
go build -o fsm-backend main.go
./fsm-backend
```

### Frontend
```bash
npm run build
# Deploy dist/ folder to web server
```

## Support

For issues or questions, check:
- Backend README: `backend/README.md`
- API documentation in this file
- Component documentation in code comments
