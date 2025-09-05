# Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ on production server
- MySQL/PostgreSQL database
- Domain name and SSL certificate
- Web server (nginx/Apache)

### 1. Environment Setup

#### Backend Environment
Create `backend/.env` for production:
```env
# Database (Production)
DATABASE_URL="mysql://username:password@localhost:3306/measurement_reports"

# JWT (Use strong secret)
JWT_SECRET="your-very-strong-jwt-secret-here"
JWT_EXPIRES_IN="24h"

# API Keys (Use strong secret)
API_KEY_SECRET="your-very-strong-api-key-secret-here"

# Server
PORT=3001
NODE_ENV=production

# Frontend URL
FRONTEND_URL="https://your-domain.com"
```

#### Frontend Environment
Create `frontend/.env` for production:
```env
VITE_API_URL=https://your-api-domain.com
```

### 2. Database Setup

```bash
# Install dependencies
cd backend
npm install --production

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### 3. Build Frontend

```bash
cd frontend
npm install
npm run build
```

### 4. Backend Deployment

```bash
cd backend
npm install --production
npm run build
npm run start:prod
```

### 5. Web Server Configuration

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📱 cPanel Deployment

### 1. Upload Files
- Upload `frontend/dist` to `public_html`
- Upload `backend` to a subdirectory

### 2. Node.js Application
- Create Node.js application in cPanel
- Set startup file to `backend/dist/main.js`
- Set application root to backend directory

### 3. Environment Variables
Set in cPanel Node.js app:
```
DATABASE_URL=mysql://username:password@localhost:3306/database_name
JWT_SECRET=your-jwt-secret
API_KEY_SECRET=your-api-key-secret
NODE_ENV=production
PORT=3001
```

### 4. .htaccess for Frontend
```apache
RewriteEngine On
RewriteBase /

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

## 🔒 Security Checklist

- [ ] Use strong JWT secrets
- [ ] Use HTTPS in production
- [ ] Set secure database passwords
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Regular security updates
- [ ] Database backups

## 📊 Monitoring

### Health Checks
- Backend: `GET /api/health`
- Database connectivity
- API response times

### Logs
- Application logs
- Error tracking
- Performance monitoring

## 🔄 Updates

### Frontend Updates
```bash
cd frontend
git pull
npm install
npm run build
# Deploy dist/ folder
```

### Backend Updates
```bash
cd backend
git pull
npm install --production
npm run build
pm2 restart app
```

## 🆘 Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL
2. **CORS Errors**: Verify FRONTEND_URL
3. **Build Failures**: Check Node.js version
4. **API Not Working**: Verify port and proxy settings

### Logs
```bash
# Backend logs
pm2 logs app

# Nginx logs
tail -f /var/log/nginx/error.log
```