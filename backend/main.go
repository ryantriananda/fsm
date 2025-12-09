package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

var db *sql.DB

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// Asset Category
type AssetCategory struct {
	ID           int       `json:"id"`
	Code         string    `json:"code"`
	Name         string    `json:"name"`
	Type         string    `json:"type"`
	Depreciation string    `json:"depreciation"`
	Life         int       `json:"life"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Asset Location
type AssetLocation struct {
	ID        int       `json:"id"`
	Code      string    `json:"code"`
	Building  string    `json:"building"`
	Floor     string    `json:"floor"`
	Room      string    `json:"room"`
	PIC       string    `json:"pic"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Asset Status
type AssetStatus struct {
	ID          int       `json:"id"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	IsActive    string    `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Asset
type Asset struct {
	ID                   int       `json:"id"`
	Code                 string    `json:"code"`
	Name                 string    `json:"name"`
	CategoryID           int       `json:"category_id"`
	LocationID           int       `json:"location_id"`
	StatusID             int       `json:"status_id"`
	VendorID             int       `json:"vendor_id"`
	AcquisitionCost      float64   `json:"acquisition_cost"`
	ResidualValue        float64   `json:"residual_value"`
	UsefulLife           int       `json:"useful_life"`
	DepreciationMethod   string    `json:"depreciation_method"`
	BookValue            float64   `json:"book_value"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

// Vendor
type Vendor struct {
	ID            int       `json:"id"`
	Code          string    `json:"code"`
	Name          string    `json:"name"`
	ContactPerson string    `json:"contact_person"`
	Email         string    `json:"email"`
	Phone         string    `json:"phone"`
	Address       string    `json:"address"`
	City          string    `json:"city"`
	Country       string    `json:"country"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// Contract
type Contract struct {
	ID        int       `json:"id"`
	Code      string    `json:"code"`
	Title     string    `json:"title"`
	PartyName string    `json:"party_name"`
	Type      string    `json:"type"`
	StartDate string    `json:"start_date"`
	EndDate   string    `json:"end_date"`
	Status    string    `json:"status"`
	Value     float64   `json:"value"`
	AssetID   int       `json:"asset_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Maintenance Schedule
type MaintenanceSchedule struct {
	ID                  int       `json:"id"`
	AssetID             int       `json:"asset_id"`
	MaintenanceTypeID   int       `json:"maintenance_type_id"`
	Interval            string    `json:"interval"`
	LastDate            string    `json:"last_date"`
	NextDate            string    `json:"next_date"`
	VendorID            int       `json:"vendor_id"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

// Maintenance Type
type MaintenanceType struct {
	ID        int       `json:"id"`
	Code      string    `json:"code"`
	Name      string    `json:"name"`
	SLA       int       `json:"sla"`
	EstCost   float64   `json:"est_cost"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Disposal
type Disposal struct {
	ID        int       `json:"id"`
	Date      string    `json:"date"`
	Type      string    `json:"type"`
	AssetID   int       `json:"asset_id"`
	Details   string    `json:"details"`
	Value     float64   `json:"value"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Asset Document
type AssetDocument struct {
	ID         int       `json:"id"`
	AssetID    int       `json:"asset_id"`
	DocType    string    `json:"doc_type"`
	DocNumber  string    `json:"doc_number"`
	IssueDate  string    `json:"issue_date"`
	ExpiryDate string    `json:"expiry_date"`
	Notes      string    `json:"notes"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// Sparepart
type Sparepart struct {
	ID        int       `json:"id"`
	Code      string    `json:"code"`
	Name      string    `json:"name"`
	Category  string    `json:"category"`
	Stock     int       `json:"stock"`
	MinStock  int       `json:"min_stock"`
	Unit      string    `json:"unit"`
	AssetID   int       `json:"asset_id"`
	VendorID  int       `json:"vendor_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Asset Role
type AssetRole struct {
	ID            int       `json:"id"`
	UserName      string    `json:"user_name"`
	Department    string    `json:"department"`
	Role          string    `json:"role"`
	ApprovalLimit float64   `json:"approval_limit"`
	MenuAccess    string    `json:"menu_access"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

func init() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://postgres:postgres@localhost/fsm_db?sslmode=disable"
	}

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	log.Println("Database connected successfully")
}

func main() {
	router := mux.NewRouter()

	// CORS middleware
	router.Use(corsMiddleware)

	// Health check
	router.HandleFunc("/api/health", healthHandler).Methods("GET")

	// Asset Categories
	router.HandleFunc("/api/asset-categories", getAssetCategories).Methods("GET")
	router.HandleFunc("/api/asset-categories", createAssetCategory).Methods("POST")
	router.HandleFunc("/api/asset-categories/{id}", updateAssetCategory).Methods("PUT")
	router.HandleFunc("/api/asset-categories/{id}", deleteAssetCategory).Methods("DELETE")

	// Asset Locations
	router.HandleFunc("/api/asset-locations", getAssetLocations).Methods("GET")
	router.HandleFunc("/api/asset-locations", createAssetLocation).Methods("POST")
	router.HandleFunc("/api/asset-locations/{id}", updateAssetLocation).Methods("PUT")
	router.HandleFunc("/api/asset-locations/{id}", deleteAssetLocation).Methods("DELETE")

	// Asset Status
	router.HandleFunc("/api/asset-statuses", getAssetStatuses).Methods("GET")
	router.HandleFunc("/api/asset-statuses", createAssetStatus).Methods("POST")
	router.HandleFunc("/api/asset-statuses/{id}", updateAssetStatus).Methods("PUT")
	router.HandleFunc("/api/asset-statuses/{id}", deleteAssetStatus).Methods("DELETE")

	// Assets
	router.HandleFunc("/api/assets", getAssets).Methods("GET")
	router.HandleFunc("/api/assets", createAsset).Methods("POST")
	router.HandleFunc("/api/assets/{id}", updateAsset).Methods("PUT")
	router.HandleFunc("/api/assets/{id}", deleteAsset).Methods("DELETE")

	// Vendors
	router.HandleFunc("/api/vendors", getVendors).Methods("GET")
	router.HandleFunc("/api/vendors", createVendor).Methods("POST")
	router.HandleFunc("/api/vendors/{id}", updateVendor).Methods("PUT")
	router.HandleFunc("/api/vendors/{id}", deleteVendor).Methods("DELETE")

	// Contracts
	router.HandleFunc("/api/contracts", getContracts).Methods("GET")
	router.HandleFunc("/api/contracts", createContract).Methods("POST")
	router.HandleFunc("/api/contracts/{id}", updateContract).Methods("PUT")
	router.HandleFunc("/api/contracts/{id}", deleteContract).Methods("DELETE")

	// Maintenance Schedules
	router.HandleFunc("/api/maintenance-schedules", getMaintenanceSchedules).Methods("GET")
	router.HandleFunc("/api/maintenance-schedules", createMaintenanceSchedule).Methods("POST")
	router.HandleFunc("/api/maintenance-schedules/{id}", updateMaintenanceSchedule).Methods("PUT")
	router.HandleFunc("/api/maintenance-schedules/{id}", deleteMaintenanceSchedule).Methods("DELETE")

	// Maintenance Types
	router.HandleFunc("/api/maintenance-types", getMaintenanceTypes).Methods("GET")
	router.HandleFunc("/api/maintenance-types", createMaintenanceType).Methods("POST")
	router.HandleFunc("/api/maintenance-types/{id}", updateMaintenanceType).Methods("PUT")
	router.HandleFunc("/api/maintenance-types/{id}", deleteMaintenanceType).Methods("DELETE")

	// Disposals
	router.HandleFunc("/api/disposals", getDisposals).Methods("GET")
	router.HandleFunc("/api/disposals", createDisposal).Methods("POST")
	router.HandleFunc("/api/disposals/{id}", updateDisposal).Methods("PUT")
	router.HandleFunc("/api/disposals/{id}", deleteDisposal).Methods("DELETE")

	// Asset Documents
	router.HandleFunc("/api/asset-documents", getAssetDocuments).Methods("GET")
	router.HandleFunc("/api/asset-documents", createAssetDocument).Methods("POST")
	router.HandleFunc("/api/asset-documents/{id}", updateAssetDocument).Methods("PUT")
	router.HandleFunc("/api/asset-documents/{id}", deleteAssetDocument).Methods("DELETE")

	// Spareparts
	router.HandleFunc("/api/spareparts", getSpareparts).Methods("GET")
	router.HandleFunc("/api/spareparts", createSparepart).Methods("POST")
	router.HandleFunc("/api/spareparts/{id}", updateSparepart).Methods("PUT")
	router.HandleFunc("/api/spareparts/{id}", deleteSparepart).Methods("DELETE")

	// Asset Roles
	router.HandleFunc("/api/asset-roles", getAssetRoles).Methods("GET")
	router.HandleFunc("/api/asset-roles", createAssetRole).Methods("POST")
	router.HandleFunc("/api/asset-roles/{id}", updateAssetRole).Methods("PUT")
	router.HandleFunc("/api/asset-roles/{id}", deleteAssetRole).Methods("DELETE")

	// ATK Categories
	router.HandleFunc("/api/atk-categories", getATKCategories).Methods("GET")
	router.HandleFunc("/api/atk-categories", createATKCategory).Methods("POST")
	router.HandleFunc("/api/atk-categories/{id}", updateATKCategory).Methods("PUT")
	router.HandleFunc("/api/atk-categories/{id}", deleteATKCategory).Methods("DELETE")

	// ATK Items
	router.HandleFunc("/api/atk-items", getATKItems).Methods("GET")
	router.HandleFunc("/api/atk-items", createATKItem).Methods("POST")
	router.HandleFunc("/api/atk-items/{id}", updateATKItem).Methods("PUT")
	router.HandleFunc("/api/atk-items/{id}", deleteATKItem).Methods("DELETE")

	// ATK Stock Transactions
	router.HandleFunc("/api/atk-transactions", getATKTransactions).Methods("GET")
	router.HandleFunc("/api/atk-transactions", createATKTransaction).Methods("POST")

	// ATK Requests
	router.HandleFunc("/api/atk-requests", getATKRequests).Methods("GET")
	router.HandleFunc("/api/atk-requests", createATKRequest).Methods("POST")
	router.HandleFunc("/api/atk-requests/{id}", updateATKRequest).Methods("PUT")
	router.HandleFunc("/api/atk-requests/{id}", deleteATKRequest).Methods("DELETE")
	router.HandleFunc("/api/atk-requests/{id}/approve", approveATKRequest).Methods("POST")
	router.HandleFunc("/api/atk-requests/{id}/reject", rejectATKRequest).Methods("POST")

	fmt.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{Success: true, Message: "OK"})
}

// Asset Categories Handlers
func getAssetCategories(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, code, name, type, depreciation, life, created_at, updated_at FROM asset_categories")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var categories []AssetCategory
	for rows.Next() {
		var cat AssetCategory
		if err := rows.Scan(&cat.ID, &cat.Code, &cat.Name, &cat.Type, &cat.Depreciation, &cat.Life, &cat.CreatedAt, &cat.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		categories = append(categories, cat)
	}

	respondSuccess(w, categories)
}

func createAssetCategory(w http.ResponseWriter, r *http.Request) {
	var cat AssetCategory
	if err := json.NewDecoder(r.Body).Decode(&cat); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO asset_categories (code, name, type, depreciation, life) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at",
		cat.Code, cat.Name, cat.Type, cat.Depreciation, cat.Life,
	).Scan(&cat.ID, &cat.CreatedAt, &cat.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, cat)
}

func updateAssetCategory(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var cat AssetCategory
	if err := json.NewDecoder(r.Body).Decode(&cat); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE asset_categories SET code=$1, name=$2, type=$3, depreciation=$4, life=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6",
		cat.Code, cat.Name, cat.Type, cat.Depreciation, cat.Life, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteAssetCategory(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM asset_categories WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Asset Locations Handlers
func getAssetLocations(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, code, building, floor, room, pic, created_at, updated_at FROM asset_locations")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var locations []AssetLocation
	for rows.Next() {
		var loc AssetLocation
		if err := rows.Scan(&loc.ID, &loc.Code, &loc.Building, &loc.Floor, &loc.Room, &loc.PIC, &loc.CreatedAt, &loc.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		locations = append(locations, loc)
	}

	respondSuccess(w, locations)
}

func createAssetLocation(w http.ResponseWriter, r *http.Request) {
	var loc AssetLocation
	if err := json.NewDecoder(r.Body).Decode(&loc); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO asset_locations (code, building, floor, room, pic) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at",
		loc.Code, loc.Building, loc.Floor, loc.Room, loc.PIC,
	).Scan(&loc.ID, &loc.CreatedAt, &loc.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, loc)
}

func updateAssetLocation(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var loc AssetLocation
	if err := json.NewDecoder(r.Body).Decode(&loc); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE asset_locations SET code=$1, building=$2, floor=$3, room=$4, pic=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6",
		loc.Code, loc.Building, loc.Floor, loc.Room, loc.PIC, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteAssetLocation(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM asset_locations WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Asset Status Handlers
func getAssetStatuses(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, code, name, description, is_active, created_at, updated_at FROM asset_statuses")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var statuses []AssetStatus
	for rows.Next() {
		var status AssetStatus
		if err := rows.Scan(&status.ID, &status.Code, &status.Name, &status.Description, &status.IsActive, &status.CreatedAt, &status.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		statuses = append(statuses, status)
	}

	respondSuccess(w, statuses)
}

func createAssetStatus(w http.ResponseWriter, r *http.Request) {
	var status AssetStatus
	if err := json.NewDecoder(r.Body).Decode(&status); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO asset_statuses (code, name, description, is_active) VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at",
		status.Code, status.Name, status.Description, status.IsActive,
	).Scan(&status.ID, &status.CreatedAt, &status.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, status)
}

func updateAssetStatus(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var status AssetStatus
	if err := json.NewDecoder(r.Body).Decode(&status); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE asset_statuses SET code=$1, name=$2, description=$3, is_active=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5",
		status.Code, status.Name, status.Description, status.IsActive, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteAssetStatus(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM asset_statuses WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Assets Handlers
func getAssets(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, code, name, category_id, location_id, status_id, vendor_id, acquisition_cost, residual_value, useful_life, depreciation_method, book_value, created_at, updated_at FROM assets")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var assets []Asset
	for rows.Next() {
		var asset Asset
		if err := rows.Scan(&asset.ID, &asset.Code, &asset.Name, &asset.CategoryID, &asset.LocationID, &asset.StatusID, &asset.VendorID, &asset.AcquisitionCost, &asset.ResidualValue, &asset.UsefulLife, &asset.DepreciationMethod, &asset.BookValue, &asset.CreatedAt, &asset.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		assets = append(assets, asset)
	}

	respondSuccess(w, assets)
}

func createAsset(w http.ResponseWriter, r *http.Request) {
	var asset Asset
	if err := json.NewDecoder(r.Body).Decode(&asset); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO assets (code, name, category_id, location_id, status_id, vendor_id, acquisition_cost, residual_value, useful_life, depreciation_method, book_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, created_at, updated_at",
		asset.Code, asset.Name, asset.CategoryID, asset.LocationID, asset.StatusID, asset.VendorID, asset.AcquisitionCost, asset.ResidualValue, asset.UsefulLife, asset.DepreciationMethod, asset.BookValue,
	).Scan(&asset.ID, &asset.CreatedAt, &asset.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, asset)
}

func updateAsset(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var asset Asset
	if err := json.NewDecoder(r.Body).Decode(&asset); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE assets SET code=$1, name=$2, category_id=$3, location_id=$4, status_id=$5, vendor_id=$6, acquisition_cost=$7, residual_value=$8, useful_life=$9, depreciation_method=$10, book_value=$11, updated_at=CURRENT_TIMESTAMP WHERE id=$12",
		asset.Code, asset.Name, asset.CategoryID, asset.LocationID, asset.StatusID, asset.VendorID, asset.AcquisitionCost, asset.ResidualValue, asset.UsefulLife, asset.DepreciationMethod, asset.BookValue, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteAsset(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM assets WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Vendors Handlers
func getVendors(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, code, name, contact_person, email, phone, address, city, country, created_at, updated_at FROM vendors")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var vendors []Vendor
	for rows.Next() {
		var vendor Vendor
		if err := rows.Scan(&vendor.ID, &vendor.Code, &vendor.Name, &vendor.ContactPerson, &vendor.Email, &vendor.Phone, &vendor.Address, &vendor.City, &vendor.Country, &vendor.CreatedAt, &vendor.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		vendors = append(vendors, vendor)
	}

	respondSuccess(w, vendors)
}

func createVendor(w http.ResponseWriter, r *http.Request) {
	var vendor Vendor
	if err := json.NewDecoder(r.Body).Decode(&vendor); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO vendors (code, name, contact_person, email, phone, address, city, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at, updated_at",
		vendor.Code, vendor.Name, vendor.ContactPerson, vendor.Email, vendor.Phone, vendor.Address, vendor.City, vendor.Country,
	).Scan(&vendor.ID, &vendor.CreatedAt, &vendor.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, vendor)
}

func updateVendor(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var vendor Vendor
	if err := json.NewDecoder(r.Body).Decode(&vendor); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE vendors SET code=$1, name=$2, contact_person=$3, email=$4, phone=$5, address=$6, city=$7, country=$8, updated_at=CURRENT_TIMESTAMP WHERE id=$9",
		vendor.Code, vendor.Name, vendor.ContactPerson, vendor.Email, vendor.Phone, vendor.Address, vendor.City, vendor.Country, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteVendor(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM vendors WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Contracts Handlers
func getContracts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, code, title, party_name, type, start_date, end_date, status, value, asset_id, created_at, updated_at FROM contracts")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var contracts []Contract
	for rows.Next() {
		var contract Contract
		if err := rows.Scan(&contract.ID, &contract.Code, &contract.Title, &contract.PartyName, &contract.Type, &contract.StartDate, &contract.EndDate, &contract.Status, &contract.Value, &contract.AssetID, &contract.CreatedAt, &contract.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		contracts = append(contracts, contract)
	}

	respondSuccess(w, contracts)
}

func createContract(w http.ResponseWriter, r *http.Request) {
	var contract Contract
	if err := json.NewDecoder(r.Body).Decode(&contract); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO contracts (code, title, party_name, type, start_date, end_date, status, value, asset_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, created_at, updated_at",
		contract.Code, contract.Title, contract.PartyName, contract.Type, contract.StartDate, contract.EndDate, contract.Status, contract.Value, contract.AssetID,
	).Scan(&contract.ID, &contract.CreatedAt, &contract.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, contract)
}

func updateContract(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var contract Contract
	if err := json.NewDecoder(r.Body).Decode(&contract); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE contracts SET code=$1, title=$2, party_name=$3, type=$4, start_date=$5, end_date=$6, status=$7, value=$8, asset_id=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10",
		contract.Code, contract.Title, contract.PartyName, contract.Type, contract.StartDate, contract.EndDate, contract.Status, contract.Value, contract.AssetID, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteContract(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM contracts WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Maintenance Schedules Handlers
func getMaintenanceSchedules(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, asset_id, maintenance_type_id, interval, last_date, next_date, vendor_id, created_at, updated_at FROM maintenance_schedules")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var schedules []MaintenanceSchedule
	for rows.Next() {
		var schedule MaintenanceSchedule
		if err := rows.Scan(&schedule.ID, &schedule.AssetID, &schedule.MaintenanceTypeID, &schedule.Interval, &schedule.LastDate, &schedule.NextDate, &schedule.VendorID, &schedule.CreatedAt, &schedule.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		schedules = append(schedules, schedule)
	}

	respondSuccess(w, schedules)
}

func createMaintenanceSchedule(w http.ResponseWriter, r *http.Request) {
	var schedule MaintenanceSchedule
	if err := json.NewDecoder(r.Body).Decode(&schedule); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO maintenance_schedules (asset_id, maintenance_type_id, interval, last_date, next_date, vendor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at, updated_at",
		schedule.AssetID, schedule.MaintenanceTypeID, schedule.Interval, schedule.LastDate, schedule.NextDate, schedule.VendorID,
	).Scan(&schedule.ID, &schedule.CreatedAt, &schedule.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, schedule)
}

func updateMaintenanceSchedule(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var schedule MaintenanceSchedule
	if err := json.NewDecoder(r.Body).Decode(&schedule); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE maintenance_schedules SET asset_id=$1, maintenance_type_id=$2, interval=$3, last_date=$4, next_date=$5, vendor_id=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7",
		schedule.AssetID, schedule.MaintenanceTypeID, schedule.Interval, schedule.LastDate, schedule.NextDate, schedule.VendorID, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteMaintenanceSchedule(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM maintenance_schedules WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Maintenance Types Handlers
func getMaintenanceTypes(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, code, name, sla, est_cost, created_at, updated_at FROM maintenance_types")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var types []MaintenanceType
	for rows.Next() {
		var t MaintenanceType
		if err := rows.Scan(&t.ID, &t.Code, &t.Name, &t.SLA, &t.EstCost, &t.CreatedAt, &t.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		types = append(types, t)
	}

	respondSuccess(w, types)
}

func createMaintenanceType(w http.ResponseWriter, r *http.Request) {
	var t MaintenanceType
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO maintenance_types (code, name, sla, est_cost) VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at",
		t.Code, t.Name, t.SLA, t.EstCost,
	).Scan(&t.ID, &t.CreatedAt, &t.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, t)
}

func updateMaintenanceType(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var t MaintenanceType
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE maintenance_types SET code=$1, name=$2, sla=$3, est_cost=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5",
		t.Code, t.Name, t.SLA, t.EstCost, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteMaintenanceType(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM maintenance_types WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Disposals Handlers
func getDisposals(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, date, type, asset_id, details, value, created_at, updated_at FROM disposals")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var disposals []Disposal
	for rows.Next() {
		var disposal Disposal
		if err := rows.Scan(&disposal.ID, &disposal.Date, &disposal.Type, &disposal.AssetID, &disposal.Details, &disposal.Value, &disposal.CreatedAt, &disposal.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		disposals = append(disposals, disposal)
	}

	respondSuccess(w, disposals)
}

func createDisposal(w http.ResponseWriter, r *http.Request) {
	var disposal Disposal
	if err := json.NewDecoder(r.Body).Decode(&disposal); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO disposals (date, type, asset_id, details, value) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at",
		disposal.Date, disposal.Type, disposal.AssetID, disposal.Details, disposal.Value,
	).Scan(&disposal.ID, &disposal.CreatedAt, &disposal.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, disposal)
}

func updateDisposal(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var disposal Disposal
	if err := json.NewDecoder(r.Body).Decode(&disposal); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE disposals SET date=$1, type=$2, asset_id=$3, details=$4, value=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6",
		disposal.Date, disposal.Type, disposal.AssetID, disposal.Details, disposal.Value, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteDisposal(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM disposals WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Asset Documents Handlers
func getAssetDocuments(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, asset_id, doc_type, doc_number, issue_date, expiry_date, notes, created_at, updated_at FROM asset_documents")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var documents []AssetDocument
	for rows.Next() {
		var doc AssetDocument
		if err := rows.Scan(&doc.ID, &doc.AssetID, &doc.DocType, &doc.DocNumber, &doc.IssueDate, &doc.ExpiryDate, &doc.Notes, &doc.CreatedAt, &doc.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		documents = append(documents, doc)
	}

	respondSuccess(w, documents)
}

func createAssetDocument(w http.ResponseWriter, r *http.Request) {
	var doc AssetDocument
	if err := json.NewDecoder(r.Body).Decode(&doc); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO asset_documents (asset_id, doc_type, doc_number, issue_date, expiry_date, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at, updated_at",
		doc.AssetID, doc.DocType, doc.DocNumber, doc.IssueDate, doc.ExpiryDate, doc.Notes,
	).Scan(&doc.ID, &doc.CreatedAt, &doc.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, doc)
}

func updateAssetDocument(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var doc AssetDocument
	if err := json.NewDecoder(r.Body).Decode(&doc); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE asset_documents SET asset_id=$1, doc_type=$2, doc_number=$3, issue_date=$4, expiry_date=$5, notes=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7",
		doc.AssetID, doc.DocType, doc.DocNumber, doc.IssueDate, doc.ExpiryDate, doc.Notes, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteAssetDocument(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM asset_documents WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Spareparts Handlers
func getSpareparts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, code, name, category, stock, min_stock, unit, asset_id, vendor_id, created_at, updated_at FROM spareparts")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var spareparts []Sparepart
	for rows.Next() {
		var sp Sparepart
		if err := rows.Scan(&sp.ID, &sp.Code, &sp.Name, &sp.Category, &sp.Stock, &sp.MinStock, &sp.Unit, &sp.AssetID, &sp.VendorID, &sp.CreatedAt, &sp.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		spareparts = append(spareparts, sp)
	}

	respondSuccess(w, spareparts)
}

func createSparepart(w http.ResponseWriter, r *http.Request) {
	var sp Sparepart
	if err := json.NewDecoder(r.Body).Decode(&sp); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO spareparts (code, name, category, stock, min_stock, unit, asset_id, vendor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at, updated_at",
		sp.Code, sp.Name, sp.Category, sp.Stock, sp.MinStock, sp.Unit, sp.AssetID, sp.VendorID,
	).Scan(&sp.ID, &sp.CreatedAt, &sp.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, sp)
}

func updateSparepart(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var sp Sparepart
	if err := json.NewDecoder(r.Body).Decode(&sp); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE spareparts SET code=$1, name=$2, category=$3, stock=$4, min_stock=$5, unit=$6, asset_id=$7, vendor_id=$8, updated_at=CURRENT_TIMESTAMP WHERE id=$9",
		sp.Code, sp.Name, sp.Category, sp.Stock, sp.MinStock, sp.Unit, sp.AssetID, sp.VendorID, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteSparepart(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM spareparts WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Asset Roles Handlers
func getAssetRoles(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, user_name, department, role, approval_limit, menu_access, created_at, updated_at FROM asset_roles")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var roles []AssetRole
	for rows.Next() {
		var role AssetRole
		if err := rows.Scan(&role.ID, &role.UserName, &role.Department, &role.Role, &role.ApprovalLimit, &role.MenuAccess, &role.CreatedAt, &role.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		roles = append(roles, role)
	}

	respondSuccess(w, roles)
}

func createAssetRole(w http.ResponseWriter, r *http.Request) {
	var role AssetRole
	if err := json.NewDecoder(r.Body).Decode(&role); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO asset_roles (user_name, department, role, approval_limit, menu_access) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at",
		role.UserName, role.Department, role.Role, role.ApprovalLimit, role.MenuAccess,
	).Scan(&role.ID, &role.CreatedAt, &role.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, role)
}

func updateAssetRole(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var role AssetRole
	if err := json.NewDecoder(r.Body).Decode(&role); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE asset_roles SET user_name=$1, department=$2, role=$3, approval_limit=$4, menu_access=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6",
		role.UserName, role.Department, role.Role, role.ApprovalLimit, role.MenuAccess, id,
	)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteAssetRole(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM asset_roles WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// ATK Category
type ATKCategory struct {
	ID          int       `json:"id"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ATK Item
type ATKItem struct {
	ID           int       `json:"id"`
	Code         string    `json:"code"`
	Name         string    `json:"name"`
	CategoryID   int       `json:"category_id"`
	CategoryName string    `json:"category_name,omitempty"`
	Unit         string    `json:"unit"`
	UnitPrice    float64   `json:"unit_price"`
	Stock        int       `json:"stock"`
	MinStock     int       `json:"min_stock"`
	MaxStock     int       `json:"max_stock"`
	SupplierID   int       `json:"supplier_id"`
	Location     string    `json:"location"`
	Description  string    `json:"description"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// ATK Stock Transaction
type ATKStockTransaction struct {
	ID              int       `json:"id"`
	ItemID          int       `json:"item_id"`
	ItemName        string    `json:"item_name,omitempty"`
	TransactionType string    `json:"transaction_type"`
	Quantity        int       `json:"quantity"`
	PreviousStock   int       `json:"previous_stock"`
	NewStock        int       `json:"new_stock"`
	ReferenceType   string    `json:"reference_type"`
	ReferenceID     int       `json:"reference_id"`
	Notes           string    `json:"notes"`
	CreatedBy       string    `json:"created_by"`
	CreatedAt       time.Time `json:"created_at"`
}

// ATK Request
type ATKRequest struct {
	ID              int              `json:"id"`
	RequestNumber   string           `json:"request_number"`
	EmployeeID      int              `json:"employee_id"`
	EmployeeName    string           `json:"employee_name"`
	Department      string           `json:"department"`
	RequestDate     string           `json:"request_date"`
	NeededDate      string           `json:"needed_date"`
	Purpose         string           `json:"purpose"`
	Status          string           `json:"status"`
	ApprovedBy      string           `json:"approved_by"`
	ApprovedDate    string           `json:"approved_date"`
	RejectionReason string           `json:"rejection_reason"`
	Notes           string           `json:"notes"`
	Items           []ATKRequestItem `json:"items,omitempty"`
	CreatedAt       time.Time        `json:"created_at"`
	UpdatedAt       time.Time        `json:"updated_at"`
}

// ATK Request Item
type ATKRequestItem struct {
	ID                int    `json:"id"`
	RequestID         int    `json:"request_id"`
	ItemID            int    `json:"item_id"`
	ItemName          string `json:"item_name,omitempty"`
	ItemCode          string `json:"item_code,omitempty"`
	Unit              string `json:"unit,omitempty"`
	QuantityRequested int    `json:"quantity_requested"`
	QuantityApproved  int    `json:"quantity_approved"`
	QuantityIssued    int    `json:"quantity_issued"`
	Status            string `json:"status"`
	Notes             string `json:"notes"`
}

// ATK Categories Handlers
func getATKCategories(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, code, name, COALESCE(description, ''), created_at, updated_at FROM atk_categories ORDER BY name")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var categories []ATKCategory
	for rows.Next() {
		var cat ATKCategory
		if err := rows.Scan(&cat.ID, &cat.Code, &cat.Name, &cat.Description, &cat.CreatedAt, &cat.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		categories = append(categories, cat)
	}
	respondSuccess(w, categories)
}

func createATKCategory(w http.ResponseWriter, r *http.Request) {
	var cat ATKCategory
	if err := json.NewDecoder(r.Body).Decode(&cat); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		"INSERT INTO atk_categories (code, name, description) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at",
		cat.Code, cat.Name, cat.Description,
	).Scan(&cat.ID, &cat.CreatedAt, &cat.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, cat)
}

func updateATKCategory(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var cat ATKCategory
	if err := json.NewDecoder(r.Body).Decode(&cat); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		"UPDATE atk_categories SET code=$1, name=$2, description=$3, updated_at=CURRENT_TIMESTAMP WHERE id=$4",
		cat.Code, cat.Name, cat.Description, id,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteATKCategory(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM atk_categories WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// ATK Items Handlers
func getATKItems(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT i.id, i.code, i.name, i.category_id, COALESCE(c.name, ''), i.unit, i.unit_price, 
		       i.stock, i.min_stock, i.max_stock, COALESCE(i.supplier_id, 0), COALESCE(i.location, ''), 
		       COALESCE(i.description, ''), i.is_active, i.created_at, i.updated_at 
		FROM atk_items i 
		LEFT JOIN atk_categories c ON i.category_id = c.id 
		ORDER BY i.name`)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var items []ATKItem
	for rows.Next() {
		var item ATKItem
		if err := rows.Scan(&item.ID, &item.Code, &item.Name, &item.CategoryID, &item.CategoryName, 
			&item.Unit, &item.UnitPrice, &item.Stock, &item.MinStock, &item.MaxStock, 
			&item.SupplierID, &item.Location, &item.Description, &item.IsActive, 
			&item.CreatedAt, &item.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		items = append(items, item)
	}
	respondSuccess(w, items)
}

func createATKItem(w http.ResponseWriter, r *http.Request) {
	var item ATKItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.QueryRow(
		`INSERT INTO atk_items (code, name, category_id, unit, unit_price, stock, min_stock, max_stock, supplier_id, location, description, is_active) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id, created_at, updated_at`,
		item.Code, item.Name, item.CategoryID, item.Unit, item.UnitPrice, item.Stock, item.MinStock, item.MaxStock, 
		item.SupplierID, item.Location, item.Description, item.IsActive,
	).Scan(&item.ID, &item.CreatedAt, &item.UpdatedAt)

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, item)
}

func updateATKItem(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var item ATKItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		`UPDATE atk_items SET code=$1, name=$2, category_id=$3, unit=$4, unit_price=$5, stock=$6, 
		 min_stock=$7, max_stock=$8, supplier_id=$9, location=$10, description=$11, is_active=$12, 
		 updated_at=CURRENT_TIMESTAMP WHERE id=$13`,
		item.Code, item.Name, item.CategoryID, item.Unit, item.UnitPrice, item.Stock, 
		item.MinStock, item.MaxStock, item.SupplierID, item.Location, item.Description, item.IsActive, id,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func deleteATKItem(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM atk_items WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// ATK Stock Transaction Handlers
func getATKTransactions(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT t.id, t.item_id, COALESCE(i.name, ''), t.transaction_type, t.quantity, 
		       t.previous_stock, t.new_stock, COALESCE(t.reference_type, ''), COALESCE(t.reference_id, 0), 
		       COALESCE(t.notes, ''), COALESCE(t.created_by, ''), t.created_at 
		FROM atk_stock_transactions t 
		LEFT JOIN atk_items i ON t.item_id = i.id 
		ORDER BY t.created_at DESC`)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var transactions []ATKStockTransaction
	for rows.Next() {
		var tx ATKStockTransaction
		if err := rows.Scan(&tx.ID, &tx.ItemID, &tx.ItemName, &tx.TransactionType, &tx.Quantity, 
			&tx.PreviousStock, &tx.NewStock, &tx.ReferenceType, &tx.ReferenceID, 
			&tx.Notes, &tx.CreatedBy, &tx.CreatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		transactions = append(transactions, tx)
	}
	respondSuccess(w, transactions)
}

func createATKTransaction(w http.ResponseWriter, r *http.Request) {
	var tx ATKStockTransaction
	if err := json.NewDecoder(r.Body).Decode(&tx); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Get current stock
	var currentStock int
	err := db.QueryRow("SELECT stock FROM atk_items WHERE id=$1", tx.ItemID).Scan(&currentStock)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Item not found")
		return
	}

	tx.PreviousStock = currentStock
	if tx.TransactionType == "IN" {
		tx.NewStock = currentStock + tx.Quantity
	} else if tx.TransactionType == "OUT" {
		tx.NewStock = currentStock - tx.Quantity
	} else {
		tx.NewStock = tx.Quantity // For ADJUSTMENT/OPNAME
	}

	// Start transaction
	dbTx, err := db.Begin()
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Update stock
	_, err = dbTx.Exec("UPDATE atk_items SET stock=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2", tx.NewStock, tx.ItemID)
	if err != nil {
		dbTx.Rollback()
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Insert transaction
	err = dbTx.QueryRow(
		`INSERT INTO atk_stock_transactions (item_id, transaction_type, quantity, previous_stock, new_stock, reference_type, reference_id, notes, created_by) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, created_at`,
		tx.ItemID, tx.TransactionType, tx.Quantity, tx.PreviousStock, tx.NewStock, tx.ReferenceType, tx.ReferenceID, tx.Notes, tx.CreatedBy,
	).Scan(&tx.ID, &tx.CreatedAt)

	if err != nil {
		dbTx.Rollback()
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	dbTx.Commit()
	respondSuccess(w, tx)
}

// ATK Request Handlers
func getATKRequests(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT id, request_number, COALESCE(employee_id, 0), employee_name, COALESCE(department, ''), 
		       request_date, COALESCE(needed_date, '1970-01-01'), COALESCE(purpose, ''), status, 
		       COALESCE(approved_by, ''), COALESCE(approved_date, '1970-01-01'), COALESCE(rejection_reason, ''), 
		       COALESCE(notes, ''), created_at, updated_at 
		FROM atk_requests ORDER BY created_at DESC`)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var requests []ATKRequest
	for rows.Next() {
		var req ATKRequest
		if err := rows.Scan(&req.ID, &req.RequestNumber, &req.EmployeeID, &req.EmployeeName, &req.Department, 
			&req.RequestDate, &req.NeededDate, &req.Purpose, &req.Status, &req.ApprovedBy, 
			&req.ApprovedDate, &req.RejectionReason, &req.Notes, &req.CreatedAt, &req.UpdatedAt); err != nil {
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		
		// Get request items
		itemRows, err := db.Query(`
			SELECT ri.id, ri.request_id, ri.item_id, COALESCE(i.name, ''), COALESCE(i.code, ''), COALESCE(i.unit, ''),
			       ri.quantity_requested, ri.quantity_approved, ri.quantity_issued, ri.status, COALESCE(ri.notes, '')
			FROM atk_request_items ri
			LEFT JOIN atk_items i ON ri.item_id = i.id
			WHERE ri.request_id = $1`, req.ID)
		if err == nil {
			defer itemRows.Close()
			for itemRows.Next() {
				var item ATKRequestItem
				itemRows.Scan(&item.ID, &item.RequestID, &item.ItemID, &item.ItemName, &item.ItemCode, &item.Unit,
					&item.QuantityRequested, &item.QuantityApproved, &item.QuantityIssued, &item.Status, &item.Notes)
				req.Items = append(req.Items, item)
			}
		}
		requests = append(requests, req)
	}
	respondSuccess(w, requests)
}

func createATKRequest(w http.ResponseWriter, r *http.Request) {
	var req ATKRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	dbTx, err := db.Begin()
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	err = dbTx.QueryRow(
		`INSERT INTO atk_requests (request_number, employee_id, employee_name, department, request_date, needed_date, purpose, status, notes) 
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, created_at, updated_at`,
		req.RequestNumber, req.EmployeeID, req.EmployeeName, req.Department, req.RequestDate, req.NeededDate, req.Purpose, req.Status, req.Notes,
	).Scan(&req.ID, &req.CreatedAt, &req.UpdatedAt)

	if err != nil {
		dbTx.Rollback()
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Insert items
	for i, item := range req.Items {
		err = dbTx.QueryRow(
			`INSERT INTO atk_request_items (request_id, item_id, quantity_requested, quantity_approved, quantity_issued, status, notes) 
			 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
			req.ID, item.ItemID, item.QuantityRequested, item.QuantityApproved, item.QuantityIssued, item.Status, item.Notes,
		).Scan(&req.Items[i].ID)
		if err != nil {
			dbTx.Rollback()
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
	}

	dbTx.Commit()
	respondSuccess(w, req)
}

func updateATKRequest(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var req ATKRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		`UPDATE atk_requests SET employee_name=$1, department=$2, needed_date=$3, purpose=$4, status=$5, 
		 approved_by=$6, approved_date=$7, rejection_reason=$8, notes=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10`,
		req.EmployeeName, req.Department, req.NeededDate, req.Purpose, req.Status, 
		req.ApprovedBy, req.ApprovedDate, req.RejectionReason, req.Notes, id,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Updated successfully"})
}

func approveATKRequest(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var approvalData struct {
		ApprovedBy string           `json:"approved_by"`
		Items      []ATKRequestItem `json:"items"`
	}
	if err := json.NewDecoder(r.Body).Decode(&approvalData); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	dbTx, err := db.Begin()
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Update request status
	_, err = dbTx.Exec(
		`UPDATE atk_requests SET status='Approved', approved_by=$1, approved_date=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=$2`,
		approvalData.ApprovedBy, id,
	)
	if err != nil {
		dbTx.Rollback()
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Update items and deduct stock
	for _, item := range approvalData.Items {
		// Update item status
		_, err = dbTx.Exec(
			`UPDATE atk_request_items SET quantity_approved=$1, status='Approved' WHERE id=$2`,
			item.QuantityApproved, item.ID,
		)
		if err != nil {
			dbTx.Rollback()
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}

		// Deduct stock
		var currentStock int
		err = dbTx.QueryRow("SELECT stock FROM atk_items WHERE id=$1", item.ItemID).Scan(&currentStock)
		if err != nil {
			dbTx.Rollback()
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}

		newStock := currentStock - item.QuantityApproved
		_, err = dbTx.Exec("UPDATE atk_items SET stock=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2", newStock, item.ItemID)
		if err != nil {
			dbTx.Rollback()
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}

		// Record transaction
		_, err = dbTx.Exec(
			`INSERT INTO atk_stock_transactions (item_id, transaction_type, quantity, previous_stock, new_stock, reference_type, reference_id, notes, created_by) 
			 VALUES ($1, 'OUT', $2, $3, $4, 'REQUEST', $5, $6, $7)`,
			item.ItemID, item.QuantityApproved, currentStock, newStock, id, "Request approved", approvalData.ApprovedBy,
		)
		if err != nil {
			dbTx.Rollback()
			respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
	}

	dbTx.Commit()
	respondSuccess(w, map[string]string{"message": "Request approved successfully"})
}

func rejectATKRequest(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var rejectData struct {
		RejectedBy string `json:"rejected_by"`
		Reason     string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&rejectData); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err := db.Exec(
		`UPDATE atk_requests SET status='Rejected', approved_by=$1, approved_date=CURRENT_TIMESTAMP, rejection_reason=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$3`,
		rejectData.RejectedBy, rejectData.Reason, id,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Update all items to rejected
	_, err = db.Exec(`UPDATE atk_request_items SET status='Rejected' WHERE request_id=$1`, id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondSuccess(w, map[string]string{"message": "Request rejected"})
}

func deleteATKRequest(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	_, err := db.Exec("DELETE FROM atk_requests WHERE id=$1", id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondSuccess(w, map[string]string{"message": "Deleted successfully"})
}

// Helper functions
func respondSuccess(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{Success: true, Data: data})
}

func respondError(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(Response{Success: false, Message: message})
}
