#!/bin/bash

# Database Configuration Switcher
# Usage: ./scripts/switch-db.sh [development|production]

set -e

ENVIRONMENT=${1:-development}

echo "🔄 Switching to $ENVIRONMENT database configuration..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

if [ "$ENVIRONMENT" = "development" ]; then
    print_status "Configuring for development (SQLite)..."
    
    # Update schema.prisma for SQLite
    sed -i.bak 's/provider = "mysql"/provider = "sqlite"/' backend/prisma/schema.prisma
    
    # Update .env for SQLite
    if [ -f "backend/.env" ]; then
        sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL="file:./dev.db"|' backend/.env
    fi
    
    print_status "✅ Switched to SQLite for development"
    print_warning "Run 'npm run prisma:generate' to update Prisma client"
    
elif [ "$ENVIRONMENT" = "production" ]; then
    print_status "Configuring for production (MySQL)..."
    
    # Update schema.prisma for MySQL
    sed -i.bak 's/provider = "sqlite"/provider = "mysql"/' backend/prisma/schema.prisma
    
    # Update .env for MySQL (if env.production exists)
    if [ -f "backend/env.production" ]; then
        if [ ! -f "backend/.env" ]; then
            cp backend/env.production backend/.env
            print_warning "Created backend/.env from template. Please update with your actual values."
        else
            print_warning "Please manually update backend/.env with your MySQL DATABASE_URL"
        fi
    fi
    
    print_status "✅ Switched to MySQL for production"
    print_warning "Run 'npm run prisma:generate' to update Prisma client"
    
else
    echo "❌ Invalid environment. Use 'development' or 'production'"
    echo "Usage: ./scripts/switch-db.sh [development|production]"
    exit 1
fi

echo ""
print_status "Next steps:"
echo "  1. Run: npm run prisma:generate"
echo "  2. Run: npm run prisma:migrate (for development) or npm run prisma:deploy (for production)"
echo "  3. Run: npm run prisma:seed (optional)"
