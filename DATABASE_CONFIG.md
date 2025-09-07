# 🗄️ Database Configuration

## Overview

The application uses a **single Prisma schema file** (`backend/prisma/schema.prisma`) that can be configured for different database types depending on your environment.

## Database Options

### Development (SQLite)
- **File**: `file:./dev.db`
- **Provider**: `sqlite`
- **Use case**: Local development and testing
- **Pros**: No setup required, fast for development

### Production (MySQL)
- **Connection**: `mysql://username:password@localhost:3306/database_name`
- **Provider**: `mysql`
- **Use case**: cPanel hosting and production deployment
- **Pros**: Better performance, ACID compliance, concurrent access

## Quick Configuration

### Switch to Development (SQLite)
```bash
./scripts/switch-db.sh development
npm run prisma:generate
npm run prisma:migrate
```

### Switch to Production (MySQL)
```bash
./scripts/switch-db.sh production
npm run prisma:generate
npm run prisma:deploy
```

## Manual Configuration

### 1. Update Schema Provider
Edit `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"  // or "mysql"
  url      = env("DATABASE_URL")
}
```

### 2. Update Environment Variables
Edit `backend/.env`:
```env
# For SQLite (development)
DATABASE_URL="file:./dev.db"

# For MySQL (production)
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

### 3. Regenerate Prisma Client
```bash
npm run prisma:generate
```

## Migration Commands

### Development (SQLite)
```bash
npm run prisma:migrate    # Create and apply migrations
npm run prisma:seed       # Seed with sample data
```

### Production (MySQL)
```bash
npm run prisma:deploy     # Apply existing migrations
npm run prisma:seed       # Seed with sample data (optional)
```

## Environment-Specific Setup

### Development Setup
1. Use SQLite for simplicity
2. Run migrations to create database
3. Seed with test data

### Production Setup (cPanel)
1. Create MySQL database in cPanel
2. Create database user with full privileges
3. Update `DATABASE_URL` with MySQL connection
4. Deploy migrations to production database

## Troubleshooting

### Common Issues

#### "Database provider mismatch"
- Run `npm run prisma:generate` after changing provider
- Ensure `DATABASE_URL` matches the provider

#### "Connection refused"
- Check database credentials
- Verify database server is running
- Test connection manually

#### "Migration failed"
- Check database permissions
- Verify schema is compatible
- Review migration files

### Reset Database
```bash
# Development (SQLite)
rm backend/prisma/dev.db
npm run prisma:migrate
npm run prisma:seed

# Production (MySQL) - BE CAREFUL!
# This will delete all data!
npm run prisma:migrate:reset
npm run prisma:seed
```

## Best Practices

1. **Always backup** before running migrations in production
2. **Test migrations** in development first
3. **Use environment variables** for database credentials
4. **Keep schema changes** in version control
5. **Document database changes** in commit messages

---

**💡 Tip**: Use the `switch-db.sh` script to quickly switch between database configurations!
