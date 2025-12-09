# 🚀 START HERE

## Welcome to FSM (Facility & Asset Management System)

Sistem manajemen aset dan fasilitas yang lengkap dengan backend Go dan frontend React.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Setup Database
```bash
createdb fsm_db
psql fsm_db < backend/schema.sql
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
go mod download
go run main.go
```

### Step 3: Start Frontend (Terminal 2)
```bash
npm run dev
```

### Step 4: Open Browser
```
http://localhost:3000
```

**Done! 🎉**

---

## 📚 Documentation

### For First-Time Users
1. **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
2. **[SETUP.md](SETUP.md)** - Detailed setup instructions

### For Developers
1. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Full documentation
2. **[backend/API_TESTING.md](backend/API_TESTING.md)** - API testing guide
3. **[backend/README.md](backend/README.md)** - Backend API docs

### For Testing
1. **[VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)** - Testing checklist
2. **[backend/API_TESTING.md](backend/API_TESTING.md)** - API examples

### For Deployment
1. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Deployment section
2. **[COMPLETION_REPORT.md](COMPLETION_REPORT.md)** - Project status

### All Documentation
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete documentation index

---

## 🎯 What's Included

### Backend
- ✅ REST API dengan CRUD lengkap
- ✅ PostgreSQL database
- ✅ 24 API endpoints
- ✅ CORS enabled

### Frontend
- ✅ React + TypeScript
- ✅ Reusable CRUD component
- ✅ 12+ master data modules
- ✅ Search & filter

### Database
- ✅ 18 tables
- ✅ Foreign key relationships
- ✅ Audit trail (timestamps)

### Documentation
- ✅ 7 documentation files
- ✅ Setup scripts
- ✅ Testing guides
- ✅ API examples

---

## 🔧 Common Tasks

### Test API
```bash
# Health check
curl http://localhost:8080/api/health

# Get all categories
curl http://localhost:8080/api/asset-categories

# Create category
curl -X POST http://localhost:8080/api/asset-categories \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST","name":"Test Category"}'
```

### Test Frontend
1. Open http://localhost:3000
2. Go to Master Asset > Kategori Asset
3. Click "Add New"
4. Fill form and save
5. Try Edit and Delete

### Check Database
```bash
psql fsm_db
\dt                    # List tables
SELECT * FROM asset_categories;
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL
psql -U postgres -c "SELECT 1"

# Create database
createdb fsm_db

# Import schema
psql fsm_db < backend/schema.sql
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Frontend Blank Page
- Check browser console (F12)
- Verify backend: `curl http://localhost:8080/api/health`
- Clear cache and refresh

---

## 📊 Project Status

| Component | Status |
|-----------|--------|
| Backend | ✅ Complete |
| Frontend | ✅ Complete |
| Database | ✅ Complete |
| Documentation | ✅ Complete |
| Testing | ✅ Ready |
| Deployment | ✅ Ready |

---

## 🎨 Available Modules

### Master Data (with CRUD)
- Asset Categories
- Asset Locations
- Asset Status
- Asset Management
- Vendor Management
- Contract Management
- Maintenance Schedules
- Maintenance Types
- Sparepart Inventory
- Disposal & Mutation
- Asset Documents
- Role & Access Control

### Other Modules
- ATK (Office Supplies)
- ARK (Office Equipment)
- Timesheet
- Credit Card
- Log Book
- Project Management

---

## 📁 File Structure

```
fsm/
├── backend/              # Go API server
│   ├── main.go          # API endpoints
│   ├── schema.sql       # Database schema
│   └── README.md        # Backend docs
├── services/            # API clients
│   └── apiService.ts    # API integration
├── components/          # React components
│   └── MasterCRUD.tsx   # Reusable CRUD
├── App.tsx              # Main routing
├── QUICKSTART.md        # Quick start
├── SETUP.md             # Setup guide
└── [other docs]
```

---

## 🚀 Next Steps

1. **Setup** - Follow QUICKSTART.md
2. **Test** - Use VERIFICATION_CHECKLIST.md
3. **Develop** - Check IMPLEMENTATION_SUMMARY.md
4. **Deploy** - Follow deployment guide

---

## 📞 Need Help?

1. Check **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** for all docs
2. Check **[QUICKSTART.md](QUICKSTART.md)** for setup issues
3. Check **[backend/API_TESTING.md](backend/API_TESTING.md)** for API issues
4. Check browser console for frontend errors
5. Check backend logs for API errors

---

## ✅ Checklist

- [ ] Database created
- [ ] Backend running
- [ ] Frontend running
- [ ] Can access http://localhost:3000
- [ ] Can create/edit/delete data
- [ ] All modules working

---

## 🎉 Ready?

**Let's go! Pick one:**

1. **[QUICKSTART.md](QUICKSTART.md)** - Setup in 5 minutes
2. **[SETUP.md](SETUP.md)** - Detailed setup
3. **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - All documentation

---

**Happy coding! 🚀**

---

**Last Updated:** December 9, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready to Use
