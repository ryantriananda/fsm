#!/bin/bash

# FSM Database Initialization Script

echo "🔧 FSM Database Setup"
echo "===================="

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Create database
echo "📦 Creating database 'fsm_db'..."
createdb fsm_db 2>/dev/null || echo "⚠️  Database 'fsm_db' already exists"

# Import schema
echo "📋 Importing schema..."
psql fsm_db < schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "📊 Database Info:"
    psql fsm_db -c "\dt" | head -20
    echo ""
    echo "🚀 You can now run: go run main.go"
else
    echo "❌ Error importing schema. Check schema.sql file."
    exit 1
fi
