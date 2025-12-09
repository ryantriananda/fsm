@echo off
REM FSM Database Initialization Script for Windows

echo.
echo 🔧 FSM Database Setup
echo ====================
echo.

REM Check if psql is available
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ PostgreSQL is not installed or psql is not in PATH.
    echo Please install PostgreSQL and add it to your PATH.
    pause
    exit /b 1
)

REM Create database
echo 📦 Creating database 'fsm_db'...
createdb fsm_db 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Database created
) else (
    echo ⚠️  Database 'fsm_db' already exists
)

REM Import schema
echo 📋 Importing schema...
psql -d fsm_db -f schema.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database setup completed successfully!
    echo.
    echo 📊 Database Info:
    psql -d fsm_db -c "\dt"
    echo.
    echo 🚀 You can now run: go run main.go
) else (
    echo.
    echo ❌ Error importing schema. Check schema.sql file.
    pause
    exit /b 1
)

pause
