# cPanel Deployment Guide

This guide explains how to deploy your ZDN application to cPanel hosting using the `.cpanel.yml` configuration file.

## 📋 Prerequisites

- cPanel hosting account with Node.js support
- MySQL database access
- File Manager access in cPanel
- SSH access (recommended) or File Manager upload

## 🚀 Quick Deployment

### Option 1: Automated Script (Recommended)

```bash
# Run the automated deployment script
./scripts/cpanel-deploy-with-config.sh
```

This script will:
1. Build both frontend and backend
2. Create a deployment package
3. Generate necessary configuration files
4. Create a deployment archive

### Option 2: Manual Deployment

1. **Build the applications:**
   ```bash
   # Build frontend
   cd frontend
   npm run build
   
   # Build backend
   cd ../backend
   npm run build
   ```

2. **Upload files to cPanel:**
   - Upload `frontend/dist/*` to `public_html/`
   - Upload `backend/dist/*` to `public_html/api/`
   - Upload other necessary files as per the configuration

## 📁 File Structure on cPanel

```
public_html/
├── index.html              # Frontend entry point
├── assets/                 # Frontend assets
├── .htaccess              # Frontend routing
├── api/                   # Backend API
│   ├── main.js           # Backend entry point
│   ├── package.json      # Backend dependencies
│   ├── .env              # Environment variables
│   ├── prisma/           # Database schema
│   └── .htaccess         # API routing
└── scripts/              # Deployment scripts
```

## ⚙️ Configuration

### 1. Database Setup

1. **Create MySQL Database in cPanel:**
   - Go to "MySQL Databases" in cPanel
   - Create a new database (e.g., `yourusername_zdn`)
   - Create a database user with full privileges
   - Note down the credentials

2. **Update Environment Variables:**
   ```bash
   # In public_html/api/.env
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   JWT_SECRET="your-jwt-secret-here"
   API_KEY_SECRET="your-api-key-secret-here"
   NODE_ENV="production"
   ```

### 2. Node.js Configuration

1. **Set Node.js Version:**
   - Go to "Node.js Selector" in cPanel
   - Choose Node.js version (recommended: 18.x or 20.x)
   - Set the application root to `public_html/api`

2. **Install Dependencies:**
   ```bash
   cd public_html/api
   npm install --production
   ```

3. **Run Database Migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

### 3. SSL and Security

1. **Enable SSL:**
   - Go to "SSL/TLS" in cPanel
   - Enable "Force HTTPS Redirect"

2. **Security Headers:**
   - The `.htaccess` files include security headers
   - CORS is configured for API access

## 🔧 Environment Variables

Create a `.env` file in `public_html/api/` with:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT Configuration
JWT_SECRET="your-very-strong-jwt-secret-minimum-32-characters-long"

# API Key Configuration
API_KEY_SECRET="your-very-strong-api-key-secret-minimum-32-characters-long"

# Application
NODE_ENV="production"
PORT=3001

# CORS (if needed)
CORS_ORIGIN="https://yourdomain.com"
```

## 📊 Monitoring and Maintenance

### Health Check

Test your deployment:

```bash
# Frontend
curl https://yourdomain.com

# Backend API
curl https://yourdomain.com/api/health

# External API
curl -H "X-API-Key: sample-api-key-12345" https://yourdomain.com/api/reports/external/00010002
```

### Logs

- **Application Logs:** Check cPanel Error Logs
- **Database Logs:** Available in cPanel MySQL section
- **Access Logs:** Available in cPanel Raw Access Logs

### Backups

The deployment script creates automatic backups:

```bash
# Manual backup
./scripts/cpanel-backup.sh

# Backup location
backups/zdn_deployment_TIMESTAMP.tar.gz
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   - Check DATABASE_URL format
   - Verify database credentials
   - Ensure database exists and user has permissions

2. **Frontend Not Loading:**
   - Check .htaccess file is uploaded
   - Verify file permissions (644 for files, 755 for directories)
   - Check for JavaScript errors in browser console

3. **API Not Responding:**
   - Check Node.js application is running
   - Verify .htaccess in api directory
   - Check environment variables

4. **CORS Errors:**
   - Update CORS_ORIGIN in .env
   - Check .htaccess CORS headers

### File Permissions

Set correct permissions:

```bash
# Files
find public_html -type f -exec chmod 644 {} \;

# Directories
find public_html -type d -exec chmod 755 {} \;

# Scripts
chmod 755 public_html/scripts/*.sh
```

## 📈 Performance Optimization

1. **Enable Gzip Compression:**
   ```apache
   # Add to .htaccess
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/plain
       AddOutputFilterByType DEFLATE text/html
       AddOutputFilterByType DEFLATE text/xml
       AddOutputFilterByType DEFLATE text/css
       AddOutputFilterByType DEFLATE application/xml
       AddOutputFilterByType DEFLATE application/xhtml+xml
       AddOutputFilterByType DEFLATE application/rss+xml
       AddOutputFilterByType DEFLATE application/javascript
       AddOutputFilterByType DEFLATE application/x-javascript
   </IfModule>
   ```

2. **Browser Caching:**
   - Already configured in .htaccess
   - Static assets cached for 1 month

3. **Database Optimization:**
   - Regular database maintenance
   - Monitor query performance

## 🔄 Updates and Rollbacks

### Updating the Application

1. Run the deployment script
2. Upload new files to cPanel
3. Run database migrations if needed
4. Test the application

### Rollback

1. Restore from backup:
   ```bash
   tar -xzf backups/zdn_deployment_PREVIOUS_TIMESTAMP.tar.gz
   ```

2. Upload previous version files
3. Restore database if needed

## 📞 Support

If you encounter issues:

1. Check the deployment logs
2. Verify all configuration files
3. Test each component individually
4. Check cPanel error logs

## 🎯 Success Checklist

- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Database connection works
- [ ] Authentication functions
- [ ] External API accessible
- [ ] SSL certificate active
- [ ] All forms working
- [ ] File uploads working
- [ ] Email notifications working (if configured)

---

**Note:** This deployment guide is based on the `.cpanel.yml` configuration file. Make sure to customize the settings according to your specific cPanel hosting environment.
