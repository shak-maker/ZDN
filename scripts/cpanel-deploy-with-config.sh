#!/bin/bash

# cPanel Deployment Script with .cpanel.yml configuration
# This script automates the deployment process to cPanel hosting

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/Users/shaq/Documents/ZDN"
CPANEL_CONFIG=".cpanel.yml"
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}🚀 Starting cPanel Deployment...${NC}"

# Check if .cpanel.yml exists
if [ ! -f "$PROJECT_DIR/$CPANEL_CONFIG" ]; then
    echo -e "${RED}❌ Error: .cpanel.yml not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found .cpanel.yml configuration${NC}"

# Step 1: Build Frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd "$PROJECT_DIR/frontend"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

# Step 2: Build Backend
echo -e "${YELLOW}📦 Building backend...${NC}"
cd "$PROJECT_DIR/backend"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi

# Step 3: Create deployment package
echo -e "${YELLOW}📁 Creating deployment package...${NC}"
cd "$PROJECT_DIR"

# Create backup
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
fi

# Create deployment directory
DEPLOY_DIR="deploy_$TIMESTAMP"
mkdir -p "$DEPLOY_DIR"

# Copy frontend dist
echo -e "${BLUE}📋 Copying frontend files...${NC}"
cp -r frontend/dist/* "$DEPLOY_DIR/"

# Copy backend dist
echo -e "${BLUE}📋 Copying backend files...${NC}"
mkdir -p "$DEPLOY_DIR/api"
cp -r backend/dist/* "$DEPLOY_DIR/api/"

# Copy necessary backend files
cp backend/package.json "$DEPLOY_DIR/api/"
cp backend/ecosystem.config.js "$DEPLOY_DIR/api/"
cp backend/env.production "$DEPLOY_DIR/api/.env"

# Copy database files
mkdir -p "$DEPLOY_DIR/api/prisma"
cp -r backend/prisma/* "$DEPLOY_DIR/api/prisma/"

# Copy scripts
mkdir -p "$DEPLOY_DIR/scripts"
cp scripts/cpanel-backup.sh "$DEPLOY_DIR/scripts/"
cp scripts/cpanel-deploy.sh "$DEPLOY_DIR/scripts/"

# Copy documentation
cp README.md "$DEPLOY_DIR/"
cp PRODUCTION_README.md "$DEPLOY_DIR/"
cp CPANEL_DEPLOYMENT.md "$DEPLOY_DIR/"

# Create .htaccess for frontend
cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
# Frontend routing
RewriteEngine On
RewriteBase /

# Handle Angular/React routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>
EOF

# Create .htaccess for API
cat > "$DEPLOY_DIR/api/.htaccess" << 'EOF'
# API routing
RewriteEngine On
RewriteBase /api/

# Handle API routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /api/main.js [QSA,L]

# CORS headers
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-API-Key"

# Handle preflight requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]
EOF

# Create deployment info file
cat > "$DEPLOY_DIR/DEPLOYMENT_INFO.txt" << EOF
Deployment Information
=====================
Timestamp: $TIMESTAMP
Frontend Build: $(date)
Backend Build: $(date)
Git Commit: $(git rev-parse HEAD)
Git Branch: $(git branch --show-current)

Files Included:
- Frontend dist files
- Backend dist files
- Database schema and migrations
- Environment configuration
- Deployment scripts
- Documentation

Next Steps:
1. Upload files to cPanel File Manager
2. Set up database in cPanel
3. Configure environment variables
4. Run database migrations
5. Test the application
EOF

echo -e "${GREEN}✅ Deployment package created: $DEPLOY_DIR${NC}"

# Step 4: Create deployment archive
echo -e "${YELLOW}📦 Creating deployment archive...${NC}"
ARCHIVE_NAME="zdn_deployment_$TIMESTAMP.tar.gz"
tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$PROJECT_DIR" "$DEPLOY_DIR"

echo -e "${GREEN}✅ Archive created: $BACKUP_DIR/$ARCHIVE_NAME${NC}"

# Step 5: Display deployment instructions
echo -e "${BLUE}📋 Deployment Instructions:${NC}"
echo -e "${YELLOW}1. Upload the contents of '$DEPLOY_DIR' to your cPanel public_html directory${NC}"
echo -e "${YELLOW}2. Set up MySQL database in cPanel${NC}"
echo -e "${YELLOW}3. Update the .env file in the api directory with your database credentials${NC}"
echo -e "${YELLOW}4. Run database migrations: cd api && npx prisma migrate deploy${NC}"
echo -e "${YELLOW}5. Test the application${NC}"

echo -e "${GREEN}🎉 Deployment package ready!${NC}"
echo -e "${BLUE}📁 Location: $PROJECT_DIR/$DEPLOY_DIR${NC}"
echo -e "${BLUE}📦 Archive: $PROJECT_DIR/$BACKUP_DIR/$ARCHIVE_NAME${NC}"

# Cleanup option
read -p "Do you want to clean up the deployment directory? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$DEPLOY_DIR"
    echo -e "${GREEN}✅ Cleanup completed${NC}"
else
    echo -e "${YELLOW}📁 Deployment directory kept: $DEPLOY_DIR${NC}"
fi

echo -e "${GREEN}🚀 Deployment process completed!${NC}"
