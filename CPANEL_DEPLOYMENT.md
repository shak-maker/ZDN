# 📱 cPanel Deployment Guide

## 🚀 Quick Start

### Prerequisites
- cPanel hosting with Node.js support
- MySQL database access
- SSH access (recommended)
- Domain name configured

### Step-by-Step Deployment

#### 1. Prepare Your Application
```bash
# Clone and setup
git clone <your-repo-url>
cd ZDN

# Copy environment template
cp backend/env.production backend/.env

# Edit environment variables
nano backend/.env
```

#### 2. Build Applications
```bash
# Build frontend
cd frontend
npm install
npm run build:prod

# Build backend
cd ../backend
npm install --production
npm run build
```

#### 3. Upload Files to cPanel

##### Frontend Files
Upload these files to `public_html/`:
- All files from `frontend/dist/` folder
- `.htaccess` file (for React Router)

##### Backend Files
Upload the entire `backend/` folder to `public_html/api/`

#### 4. Configure Database
1. Create MySQL database in cPanel
2. Create database user with full privileges
3. Update `backend/.env` with database credentials:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

#### 5. Setup Node.js Application
1. Go to cPanel → Node.js Selector
2. Create new application:
   - **Application Root**: `api`
   - **Application URL**: `your-domain.com/api`
   - **Application Startup File**: `dist/main.js`
3. Set environment variables in cPanel Node.js app

#### 6. Install Dependencies & Setup Database
```bash
# SSH into your server or use cPanel Terminal
cd public_html/api

# Install dependencies
npm install --production

# Setup database
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
```

#### 7. Start Application
```bash
# Using PM2 (recommended)
npm run pm2:start

# Or restart Node.js app in cPanel
```

## 🔧 Configuration

### Environment Variables
Set these in cPanel Node.js app or `backend/.env`:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# Security
JWT_SECRET="your-very-strong-jwt-secret-minimum-32-characters-long"
API_KEY_SECRET="your-very-strong-api-key-secret-minimum-32-characters-long"

# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL="https://your-domain.com"
```

### .htaccess Configuration
The included `.htaccess` file provides:
- React Router support
- Security headers
- Compression
- Static file caching
- API proxy (if needed)

## 🗄️ Database Setup

### Database Configuration
The application uses a **single schema file** (`backend/prisma/schema.prisma`) that can be configured for different databases:

- **Development**: SQLite (default, for local development)
- **Production**: MySQL (for cPanel hosting)

Use the database switcher script to change configurations:
```bash
# For development
./scripts/switch-db.sh development

# For production  
./scripts/switch-db.sh production
```

### MySQL Database
1. **Create Database**: In cPanel → MySQL Databases
2. **Create User**: With full privileges to the database
3. **Update Connection**: Use the credentials in `DATABASE_URL`

### Database Migration
```bash
cd public_html/api

# Switch to production database (MySQL)
./scripts/switch-db.sh production

# Generate Prisma client and run migrations
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
```

## 🛠️ Management

### PM2 Commands
```bash
# Start application
npm run pm2:start

# Stop application
npm run pm2:stop

# Restart application
npm run pm2:restart

# View logs
npm run pm2:logs

# Monitor status
pm2 status
```

### Backup Database
```bash
# Run backup script
./scripts/cpanel-backup.sh

# Manual backup
mysqldump -u username -p database_name > backup.sql
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
cd frontend && npm run build:prod
cd ../backend && npm run build
npm run pm2:restart
```

## 🔒 Security

### SSL Certificate
1. Install SSL certificate in cPanel
2. Force HTTPS redirect
3. Update `FRONTEND_URL` to use `https://`

### Security Headers
The `.htaccess` file includes:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Content-Security-Policy

### Environment Security
- Use strong passwords
- Generate secure JWT secrets
- Keep `.env` file secure
- Regular security updates

## 🆘 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
npm run pm2:logs

# Check environment variables
cat .env

# Verify database connection
npm run prisma:deploy
```

#### Database Connection Issues
```bash
# Test database connection
mysql -u username -p -h localhost database_name

# Check database credentials in .env
```

#### Frontend Not Loading
- Verify `.htaccess` is uploaded
- Check file permissions
- Ensure all files from `dist/` are uploaded

#### API Not Working
- Check Node.js app is running in cPanel
- Verify port configuration
- Check firewall settings

### Logs Location
- **PM2 Logs**: `logs/` directory
- **cPanel Logs**: cPanel → Error Logs
- **Application Logs**: `npm run pm2:logs`

## 📊 Monitoring

### Health Checks
- **Backend**: `https://your-domain.com/api/health`
- **Frontend**: `https://your-domain.com/`

### Performance Monitoring
```bash
# Check PM2 status
pm2 status

# Monitor logs
pm2 logs --lines 100

# Check system resources
pm2 monit
```

## 🔄 Updates

### Frontend Updates
```bash
cd frontend
git pull
npm install
npm run build:prod
# Upload new dist/ files to public_html/
```

### Backend Updates
```bash
cd public_html/api
git pull
npm install --production
npm run build
npm run pm2:restart
```

## 📞 Support

### Useful Commands
```bash
# Check application status
pm2 status

# View recent logs
pm2 logs --lines 50

# Restart application
pm2 restart measurement-reports-api

# Check database
npm run prisma:deploy
```

### File Structure
```
public_html/
├── index.html
├── assets/
├── .htaccess
└── api/
    ├── dist/
    ├── node_modules/
    ├── prisma/
    ├── logs/
    ├── .env
    └── ecosystem.config.js
```

---

**🎉 Your application is now deployed on cPanel!**

For additional support, check the logs and ensure all environment variables are properly configured.
