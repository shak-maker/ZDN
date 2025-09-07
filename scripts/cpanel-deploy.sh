#!/bin/bash

# cPanel Deployment Script
# Usage: ./scripts/cpanel-deploy.sh

set -e

echo "🚀 Starting cPanel deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check environment file
if [ ! -f "backend/.env" ]; then
    print_warning "Backend .env file not found. Creating from template..."
    cp backend/env.production backend/.env
    print_warning "Please update backend/.env with your actual values before continuing."
    exit 1
fi

print_status "Building frontend..."
cd frontend
npm install
npm run build:prod
print_status "Frontend build completed ✓"

print_status "Building backend..."
cd ../backend
npm install --production
npm run build
print_status "Backend build completed ✓"

print_status "Setting up database..."
npm run prisma:generate
npm run prisma:deploy
print_status "Database setup completed ✓"

print_status "Creating logs directory..."
mkdir -p logs

print_status "Starting application with PM2..."
npm run pm2:start
print_status "Application started ✓"

print_status "🎉 cPanel deployment completed successfully!"
print_warning "Next steps:"
echo "  1. Upload frontend/dist/ contents to public_html/"
echo "  2. Upload backend/ to a subdirectory (e.g., api/)"
echo "  3. Configure your domain to point to the backend API"
echo "  4. Test the application at your domain"
echo ""
print_status "Useful commands:"
echo "  - View logs: npm run pm2:logs"
echo "  - Restart app: npm run pm2:restart"
echo "  - Stop app: npm run pm2:stop"
