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
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
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
	rows, err := db.Query("SELECT id, code, name, category_id, location_id, status_id, acquisition_cost, residual_value, useful_life, depreciation_method, book_value, created_at, updated_at FROM assets")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var assets []Asset
	for rows.Next() {
		var asset Asset
		if err := rows.Scan(&asset.ID, &asset.Code, &asset.Name, &asset.CategoryID, &asset.LocationID, &asset.StatusID, &asset.AcquisitionCost, &asset.ResidualValue, &asset.UsefulLife, &asset.DepreciationMethod, &asset.BookValue, &asset.CreatedAt, &asset.UpdatedAt); err != nil {
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
		"INSERT INTO assets (code, name, category_id, location_id, status_id, acquisition_cost, residual_value, useful_life, depreciation_method, book_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, created_at, updated_at",
		asset.Code, asset.Name, asset.CategoryID, asset.LocationID, asset.StatusID, asset.AcquisitionCost, asset.ResidualValue, asset.UsefulLife, asset.DepreciationMethod, asset.BookValue,
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
		"UPDATE assets SET code=$1, name=$2, category_id=$3, location_id=$4, status_id=$5, acquisition_cost=$6, residual_value=$7, useful_life=$8, depreciation_method=$9, book_value=$10, updated_at=CURRENT_TIMESTAMP WHERE id=$11",
		asset.Code, asset.Name, asset.CategoryID, asset.LocationID, asset.StatusID, asset.AcquisitionCost, asset.ResidualValue, asset.UsefulLife, asset.DepreciationMethod, asset.BookValue, id,
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
	rows, err := db.Query("SELECT id, code, title, party_name, type, start_date, end_date, status, value, created_at, updated_at FROM contracts")
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var contracts []Contract
	for rows.Next() {
		var contract Contract
		if err := rows.Scan(&contract.ID, &contract.Code, &contract.Title, &contract.PartyName, &contract.Type, &contract.StartDate, &contract.EndDate, &contract.Status, &contract.Value, &contract.CreatedAt, &contract.UpdatedAt); err != nil {
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
		"INSERT INTO contracts (code, title, party_name, type, start_date, end_date, status, value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at, updated_at",
		contract.Code, contract.Title, contract.PartyName, contract.Type, contract.StartDate, contract.EndDate, contract.Status, contract.Value,
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
		"UPDATE contracts SET code=$1, title=$2, party_name=$3, type=$4, start_date=$5, end_date=$6, status=$7, value=$8, updated_at=CURRENT_TIMESTAMP WHERE id=$9",
		contract.Code, contract.Title, contract.PartyName, contract.Type, contract.StartDate, contract.EndDate, contract.Status, contract.Value, id,
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
