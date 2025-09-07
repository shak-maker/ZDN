# Production Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ on your server
- MySQL database (cPanel compatible)
- Domain name and SSL certificate
- PM2 process manager

### One-Command Deployment
```bash
# Clone the repository
git clone <your-repo-url>
cd ZDN

# Copy environment template
cp backend/env.production backend/.env

# Edit .env with your values
nano backend/.env

# Deploy to cPanel
./scripts/cpanel-deploy.sh
```

## 📱 cPanel Deployment (Recommended)

### Environment Setup
1. Copy the production environment template:
```bash
cp backend/env.production backend/.env
```

2. Update `backend/.env` with your production values:
```env
# Database (Use MySQL for cPanel compatibility)
DATABASE_URL="mysql://username:password@localhost:3306/measurement_reports_prod"

# Security (Generate strong secrets)
JWT_SECRET="your-very-strong-jwt-secret-minimum-32-characters-long"
API_KEY_SECRET="your-very-strong-api-key-secret-minimum-32-characters-long"

# Frontend URL
FRONTEND_URL="https://your-domain.com"

# Server
NODE_ENV=production
PORT=3001
```

### Deploy to cPanel
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Deploy application
./scripts/cpanel-deploy.sh

# Check status
npm run pm2:logs
```

### Health Checks
- Backend: `http://your-domain.com/api/health`
- Frontend: `http://your-domain.com/`
- API Docs: `http://your-domain.com/api/docs` (development only)

## 📁 cPanel File Structure

### Upload Structure
```
public_html/
├── index.html (from frontend/dist/)
├── assets/ (from frontend/dist/assets/)
├── .htaccess (for React Router)
└── api/ (backend folder)
    ├── dist/
    ├── node_modules/
    ├── prisma/
    ├── .env
    ├── ecosystem.config.js
    └── package.json
```

### 1. Upload Frontend
```bash
# Upload frontend/dist/ contents to public_html/
# Upload .htaccess to public_html/
```

### 2. Upload Backend
```bash
# Upload entire backend/ folder to public_html/api/
```

### 3. Configure cPanel Node.js App
- Create Node.js application in cPanel
- Set startup file to: `api/dist/main.js`
- Set application root to: `api/`
- Set environment variables in cPanel

### 4. Database Setup
```bash
# In cPanel terminal or SSH
cd api
npm install --production
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
```

### 5. Start Application
```bash
# Using PM2
npm run pm2:start

# Or using cPanel Node.js app
# The app will start automatically after configuration
```

## 🛠️ Management Scripts

### Deployment Script
```bash
# Full cPanel deployment
./scripts/cpanel-deploy.sh
```

### Backup Script
```bash
# Create database backup
./scripts/cpanel-backup.sh
```

### PM2 Management
```bash
# Start application
npm run pm2:start

# Stop application
npm run pm2:stop

# Restart application
npm run pm2:restart

# View logs
npm run pm2:logs
```

## 🔒 Security Features

### Implemented Security Measures
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting (100 requests/minute)
- ✅ Input validation and sanitization
- ✅ JWT authentication
- ✅ API key authentication
- ✅ Password hashing with bcrypt
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Request logging and monitoring

### Security Checklist
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Use HTTPS in production
- [ ] Set secure database passwords
- [ ] Configure CORS properly
- [ ] Set up SSL certificates
- [ ] Enable security headers
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs for suspicious activity

## 📊 Monitoring & Logging

### Health Endpoints
- **Liveness**: `GET /health/live` - Basic service health
- **Readiness**: `GET /health/ready` - Service ready to accept traffic
- **Health Check**: `GET /health` - Comprehensive health status

### Logging
- **Application Logs**: Structured JSON logging with Winston
- **Request Logging**: All HTTP requests logged with response times
- **Error Tracking**: Detailed error logging with stack traces
- **Security Events**: Authentication and authorization events

### Performance Monitoring
- Response time tracking
- Database query performance
- Memory and CPU usage
- Request rate monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions
The included `.github/workflows/deploy.yml` provides:
- Automated testing on pull requests
- Docker image building and pushing
- Production deployment automation
- Health checks after deployment

### Deployment Process
1. **Test**: Run tests and linting
2. **Build**: Create optimized Docker images
3. **Deploy**: Deploy to production environment
4. **Verify**: Run health checks

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
docker-compose exec postgres pg_isready -U postgres

# View database logs
docker-compose logs postgres
```

#### Application Not Starting
```bash
# Check application logs
docker-compose logs backend

# Check environment variables
docker-compose exec backend env | grep -E "(DATABASE_URL|JWT_SECRET)"
```

#### Frontend Not Loading
```bash
# Check nginx logs
docker-compose logs nginx

# Verify static files
docker-compose exec nginx ls -la /usr/share/nginx/html/
```

### Performance Issues
```bash
# Check resource usage
docker stats

# Monitor logs for errors
docker-compose logs -f --tail=100
```

### Recovery Procedures
```bash
# Restart all services
docker-compose restart

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Restore from backup
./scripts/backup.sh restore
```

## 📈 Scaling

### Horizontal Scaling
- Use Docker Swarm or Kubernetes
- Load balancer configuration
- Database connection pooling
- Redis for session storage

### Vertical Scaling
- Increase container resources
- Optimize database queries
- Enable caching layers
- Monitor performance metrics