# DigitalOcean Deployment Guide

This guide explains how to deploy your ZDN application to DigitalOcean using Docker and GitHub Actions.

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for VPS)

Deploy using Docker Compose on a DigitalOcean Droplet.

### Option 2: GitHub Actions + SSH

Automated deployment using GitHub Actions with SSH to your DigitalOcean Droplet.

### Option 3: DigitalOcean App Platform

Deploy directly to DigitalOcean's managed App Platform.

## 📋 Prerequisites

- DigitalOcean account
- GitHub repository with your code
- Domain name (optional, for custom domain)

## 🐳 Option 1: Docker Compose Deployment

### Step 1: Create DigitalOcean Droplet

1. **Create a new Droplet:**
   - Choose Ubuntu 22.04 LTS
   - Select size (recommended: 2GB RAM minimum)
   - Add SSH key
   - Enable monitoring

2. **Connect to your Droplet:**
   ```bash
   ssh root@YOUR_DROPLET_IP
   ```

### Step 2: Install Docker and Docker Compose

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Add user to docker group
usermod -aG docker $USER
```

### Step 3: Clone and Deploy

```bash
# Clone repository
git clone https://github.com/shak-maker/ZDN.git
cd ZDN

# Create environment file
cp .env.example .env
nano .env
```

### Step 4: Configure Environment

Create `.env` file with your settings:

```env
# Database
DATABASE_URL="mysql://root:your_password@database:3306/zdn_db"
MYSQL_ROOT_PASSWORD="your_strong_password"
MYSQL_DATABASE="zdn_db"
MYSQL_USER="zdn_user"
MYSQL_PASSWORD="your_user_password"

# JWT
JWT_SECRET="your-very-strong-jwt-secret-minimum-32-characters-long"

# API
API_KEY_SECRET="your-very-strong-api-key-secret-minimum-32-characters-long"

# App
NODE_ENV="production"
```

### Step 5: Deploy

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🤖 Option 2: GitHub Actions + SSH

### Step 1: Set up GitHub Secrets

Add these secrets to your GitHub repository:

- `DROPLET_IP`: Your DigitalOcean Droplet IP
- `DROPLET_USERNAME`: Username (usually `root`)
- `DROPLET_SSH_KEY`: Your private SSH key

### Step 2: Configure Droplet

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Create app directory
mkdir -p /var/www/zdn
cd /var/www/zdn
git clone https://github.com/shak-maker/ZDN.git .

# Install dependencies
cd frontend && npm ci && npm run build
cd ../backend && npm ci && npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'zdn-api',
    script: 'backend/dist/main.js',
    cwd: '/var/www/zdn',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 3: Configure Nginx

```bash
# Install Nginx
apt install nginx -y

# Create Nginx config
cat > /etc/nginx/sites-available/zdn << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:3001/;
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
EOF

# Enable site
ln -s /etc/nginx/sites-available/zdn /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

## 🌐 Option 3: DigitalOcean App Platform

### Step 1: Create App

1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Connect your GitHub repository
4. Select the repository and branch

### Step 2: Configure Services

**Frontend Service:**
- Source: `frontend/`
- Build Command: `npm run build`
- Output Directory: `dist`
- HTTP Port: `80`

**Backend Service:**
- Source: `backend/`
- Build Command: `npm run build`
- Run Command: `node dist/main.js`
- HTTP Port: `3001`

**Database:**
- Add MySQL database
- Configure connection string

### Step 3: Environment Variables

Set these in App Platform:
- `DATABASE_URL`
- `JWT_SECRET`
- `API_KEY_SECRET`
- `NODE_ENV=production`

## 🔧 Configuration Files

### Docker Compose
- `docker-compose.yml` - Main orchestration
- `frontend/Dockerfile` - Frontend container
- `backend/Dockerfile` - Backend container
- `nginx.conf` - Reverse proxy configuration

### GitHub Actions
- `.github/workflows/deploy.yml` - Automated deployment

## 🚀 Deployment Commands

### Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Update and restart
git pull
docker-compose up -d --build
```

### PM2 (VPS)
```bash
# Start app
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Restart
pm2 restart zdn-api

# View logs
pm2 logs zdn-api
```

## 🔍 Monitoring and Maintenance

### Health Checks
- Frontend: `http://YOUR_IP/`
- Backend: `http://YOUR_IP/api/health`
- Database: Check Docker logs or PM2 status

### Logs
```bash
# Docker Compose
docker-compose logs -f backend
docker-compose logs -f frontend

# PM2
pm2 logs zdn-api

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Updates
```bash
# Docker Compose
git pull
docker-compose up -d --build

# PM2
git pull
cd frontend && npm run build
cd ../backend && npm run build
pm2 restart zdn-api
```

## 🔒 Security Considerations

1. **Firewall:**
   ```bash
   ufw allow ssh
   ufw allow 80
   ufw allow 443
   ufw enable
   ```

2. **SSL Certificate:**
   ```bash
   # Install Certbot
   apt install certbot python3-certbot-nginx -y
   
   # Get certificate
   certbot --nginx -d yourdomain.com
   ```

3. **Database Security:**
   - Use strong passwords
   - Limit database access
   - Regular backups

## 📊 Performance Optimization

1. **Enable Gzip compression** (already configured)
2. **Set up CDN** for static assets
3. **Configure caching** headers
4. **Monitor resource usage**

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   netstat -tulpn | grep :80
   netstat -tulpn | grep :3001
   ```

2. **Permission issues:**
   ```bash
   chown -R www-data:www-data /var/www/html
   chmod -R 755 /var/www/html
   ```

3. **Database connection:**
   - Check `DATABASE_URL` format
   - Verify database is running
   - Check firewall rules

4. **Build failures:**
   - Check Node.js version
   - Clear npm cache
   - Check for missing dependencies

## 🎯 Success Checklist

- [ ] Application accessible via IP/domain
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Database connection works
- [ ] Authentication functions
- [ ] External API accessible
- [ ] SSL certificate active (if using domain)
- [ ] Monitoring set up
- [ ] Backups configured

---

**Note:** Choose the deployment method that best fits your needs. Docker Compose is recommended for full control, while App Platform is easier for managed deployment.
