# Quick Start Guide

## 5-Minute Setup

### 1. Database Setup (First Time Only)
```bash
# Create database
createdb fsm_db

# Import schema
psql fsm_db < backend/schema.sql
```

### 2. Start Backend
```bash
cd backend
go mod download
go run main.go
```
✅ Backend running at `http://localhost:8080`

### 3. Start Frontend (New Terminal)
```bash
npm run dev
```
✅ Frontend running at `http://localhost:3000`

### 4. Open Browser
Go to `http://localhost:3000` and start using the app!

---

## Testing CRUD Operations

### Via Frontend
1. Navigate to **Master Asset > Kategori Asset**
2. Click **Add New**
3. Fill form and click **Save**
4. Try Edit and Delete buttons

### Via API (curl)
```bash
# Create
curl -X POST http://localhost:8080/api/asset-categories \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST-001","name":"Test Category","type":"Moveable","depreciation":"Yes","life":5}'

# Read
curl http://localhost:8080/api/asset-categories

# Update
curl -X PUT http://localhost:8080/api/asset-categories/1 \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST-001","name":"Updated","type":"Fix","depreciation":"No","life":10}'

# Delete
curl -X DELETE http://localhost:8080/api/asset-categories/1
```

---

## Available Modules

### Master Data (with CRUD)
- ✅ Asset Categories
- ✅ Asset Locations
- ✅ Asset Status
- ✅ Asset Management
- ✅ Vendor Management
- ✅ Contract Management
- ✅ Maintenance Schedules
- ✅ Maintenance Types
- ✅ Sparepart Inventory
- ✅ Disposal & Mutation
- ✅ Asset Documents
- ✅ Role & Access Control

### Other Modules (UI Only)
- ATK (Office Supplies)
- ARK (Office Equipment)
- Timesheet
- Credit Card
- Log Book
- Project Management

---

## Troubleshooting

### "Database connection refused"
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Create database if missing
createdb fsm_db

# Import schema
psql fsm_db < backend/schema.sql
```

### "Port 8080 already in use"
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Frontend shows blank page
- Check browser console (F12)
- Verify backend is running: `curl http://localhost:8080/api/health`
- Clear browser cache and refresh

### API calls failing
- Check backend logs for errors
- Verify CORS is enabled (should be)
- Check network tab in browser DevTools

---

## File Locations

| File | Purpose |
|------|---------|
| `backend/main.go` | API server |
| `backend/schema.sql` | Database schema |
| `services/apiService.ts` | API client |
| `components/MasterCRUD.tsx` | Reusable CRUD component |
| `App.tsx` | Main routing |
| `SETUP.md` | Detailed setup guide |
| `IMPLEMENTATION_SUMMARY.md` | Full documentation |

---

## Next Steps

1. **Test all CRUD operations** in each module
2. **Add authentication** (JWT recommended)
3. **Add validation** on backend
4. **Add pagination** to API responses
5. **Add file upload** for documents
6. **Add reporting** features
7. **Deploy** to production

---

## Need Help?

- Check `SETUP.md` for detailed setup
- Check `backend/README.md` for API docs
- Check `IMPLEMENTATION_SUMMARY.md` for architecture
- Check browser console for frontend errors
- Check backend logs for API errors

---

**Happy coding! 🚀**
