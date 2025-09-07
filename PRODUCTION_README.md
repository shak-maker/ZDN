# 🚀 Measurement Reports - Production Ready

A full-stack application for managing measurement reports with canonical JSON format, now production-ready with enterprise-grade features.

## ✨ Production Features

### 🔒 Security
- **Helmet.js** - Security headers and protection
- **Rate Limiting** - 100 requests/minute with burst protection
- **JWT Authentication** - Secure token-based authentication
- **API Key Authentication** - Alternative authentication method
- **Input Validation** - Comprehensive request validation
- **CORS Protection** - Configurable cross-origin resource sharing
- **Password Hashing** - bcrypt with configurable rounds

### 📊 Monitoring & Logging
- **Health Checks** - Liveness, readiness, and comprehensive health endpoints
- **Structured Logging** - Winston-based JSON logging
- **Request Tracking** - All HTTP requests logged with response times
- **Error Monitoring** - Detailed error logging with stack traces
- **Performance Metrics** - Response time and resource usage tracking

### 🐳 Containerization
- **Docker Support** - Multi-stage optimized builds
- **Docker Compose** - Complete stack orchestration
- **Health Checks** - Container-level health monitoring
- **Non-root User** - Security-hardened containers

### 🚀 Performance
- **Code Splitting** - Optimized frontend bundle sizes
- **Compression** - Gzip compression for all responses
- **Caching** - Static asset caching with proper headers
- **Database Optimization** - Indexed queries and connection pooling

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│   Port: 80      │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Nginx Proxy   │
                    │   Load Balancer │
                    │   SSL Term.     │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- cPanel hosting with Node.js support
- MySQL database access
- SSH access (recommended)
- Domain name configured

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd ZDN

# Copy environment template
cp backend/env.production backend/.env

# Edit with your values
nano backend/.env
```

### 2. Deploy
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Deploy to cPanel
./scripts/cpanel-deploy.sh
```

### 3. Verify
```bash
# Check health
curl https://your-domain.com/api/health

# Check frontend
curl https://your-domain.com/
```

## 🔧 Configuration

### Environment Variables

#### Required
```env
DATABASE_URL="mysql://user:pass@localhost:3306/db"
JWT_SECRET="your-32-char-secret"
API_KEY_SECRET="your-32-char-secret"
FRONTEND_URL="https://your-domain.com"
```

#### Optional
```env
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
BCRYPT_ROUNDS=12
```

### Database Configuration
- **Development**: SQLite (default)
- **Production**: MySQL (cPanel compatible)
- **Migrations**: Automatic with Prisma
- **Backups**: Automated with retention

## 🛠️ Management

### Scripts
```bash
# Deploy application
./scripts/deploy.sh

# Create backup
./scripts/backup.sh

# Monitor system
./scripts/monitor.sh
```

### Docker Commands
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update and restart
docker-compose pull && docker-compose up -d
```

### Health Monitoring
```bash
# Application health
curl http://localhost:3001/health

# Database health
docker-compose exec postgres pg_isready

# System resources
docker stats
```

## 🔒 Security Checklist

### Before Production
- [ ] Change all default passwords
- [ ] Generate strong JWT secrets (32+ chars)
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up firewall rules
- [ ] Enable database encryption
- [ ] Configure backup retention
- [ ] Set up monitoring alerts
- [ ] Review access logs regularly

### Ongoing Security
- [ ] Regular security updates
- [ ] Monitor failed login attempts
- [ ] Review audit logs
- [ ] Test backup restoration
- [ ] Update dependencies
- [ ] Security scanning

## 📊 Monitoring

### Health Endpoints
- `GET /health` - Comprehensive health check
- `GET /health/live` - Liveness probe
- `GET /health/ready` - Readiness probe

### Metrics
- Response times
- Error rates
- Database performance
- Resource usage
- Request volumes

### Logs
- Application logs: `docker-compose logs backend`
- Nginx logs: `docker-compose logs nginx`
- Database logs: `docker-compose logs postgres`

## 🔄 CI/CD

### GitHub Actions
Automated pipeline includes:
1. **Testing** - Unit and integration tests
2. **Linting** - Code quality checks
3. **Building** - Docker image creation
4. **Deployment** - Production deployment
5. **Verification** - Health checks

### Manual Deployment
```bash
# Pull latest changes
git pull origin main

# Deploy
./scripts/deploy.sh

# Verify
./scripts/monitor.sh
```

## 🆘 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
docker-compose logs backend

# Verify environment
docker-compose exec backend env | grep -E "(DATABASE_URL|JWT_SECRET)"

# Check database
docker-compose exec postgres pg_isready
```

#### Database Issues
```bash
# Check connection
docker-compose exec backend npm run prisma:deploy

# Reset database
docker-compose down -v
docker-compose up -d
```

#### Performance Issues
```bash
# Check resources
docker stats

# Monitor logs
docker-compose logs -f --tail=100

# Check database performance
docker-compose exec postgres psql -U postgres -d measurement_reports_prod -c "SELECT * FROM pg_stat_activity;"
```

### Recovery Procedures
```bash
# Full restart
docker-compose down && docker-compose up -d

# Restore from backup
./scripts/backup.sh restore

# Emergency mode (single service)
docker-compose up -d postgres
docker-compose up -d backend
```

## 📈 Scaling

### Horizontal Scaling
- Use Docker Swarm or Kubernetes
- Load balancer with multiple backend instances
- Database read replicas
- Redis for session storage

### Vertical Scaling
- Increase container resources
- Optimize database queries
- Enable caching layers
- Monitor and tune performance

## 📞 Support

### Documentation
- [Deployment Guide](DEPLOYMENT.md)
- [Development Guide](DEVELOPMENT.md)
- [API Documentation](http://localhost:3001/api/docs)

### Monitoring
- Health checks: `/health`
- Metrics: Docker stats
- Logs: `docker-compose logs`

### Backup & Recovery
- Automated daily backups
- Point-in-time recovery
- Disaster recovery procedures

---

**🎉 Your application is now production-ready!**

For additional support or questions, please refer to the documentation or create an issue in the repository.
