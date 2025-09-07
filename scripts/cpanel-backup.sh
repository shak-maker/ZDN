#!/bin/bash

# cPanel Database Backup Script
# Usage: ./scripts/cpanel-backup.sh

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="measurement_reports_backup_${TIMESTAMP}.sql"

echo "🗄️  Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Load environment variables
if [ -f "backend/.env" ]; then
    export $(cat backend/.env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in backend/.env"
    exit 1
fi

# Parse database URL for different database types
if [[ $DATABASE_URL == postgresql* ]]; then
    # PostgreSQL backup
    echo "Backing up PostgreSQL database..."
    
    # Extract connection details
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    
    # Create backup
    PGPASSWORD=$DB_PASSWORD pg_dump \
        -h $DB_HOST \
        -p $DB_PORT \
        -U $DB_USER \
        -d $DB_NAME \
        --verbose \
        --clean \
        --no-owner \
        --no-privileges \
        > "$BACKUP_DIR/$BACKUP_FILE"
        
elif [[ $DATABASE_URL == mysql* ]]; then
    # MySQL backup
    echo "Backing up MySQL database..."
    
    # Extract connection details
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    
    # Create backup
    mysqldump \
        -h $DB_HOST \
        -P $DB_PORT \
        -u $DB_USER \
        -p$DB_PASSWORD \
        $DB_NAME \
        > "$BACKUP_DIR/$BACKUP_FILE"
        
elif [[ $DATABASE_URL == file:* ]]; then
    # SQLite backup
    echo "Backing up SQLite database..."
    
    DB_FILE=$(echo $DATABASE_URL | sed 's/file://')
    cp "$DB_FILE" "$BACKUP_DIR/measurement_reports_${TIMESTAMP}.db"
    
else
    echo "❌ Unsupported database type in DATABASE_URL"
    exit 1
fi

# Compress backup (for non-SQLite)
if [[ $DATABASE_URL != file:* ]]; then
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    echo "✅ Backup completed: $BACKUP_DIR/${BACKUP_FILE}.gz"
else
    echo "✅ Backup completed: $BACKUP_DIR/measurement_reports_${TIMESTAMP}.db"
fi

# Keep only last 7 days of backups
if [[ $DATABASE_URL != file:* ]]; then
    find $BACKUP_DIR -name "measurement_reports_backup_*.sql.gz" -mtime +7 -delete
else
    find $BACKUP_DIR -name "measurement_reports_*.db" -mtime +7 -delete
fi

echo "🧹 Old backups cleaned up"
echo "📁 Backup location: $BACKUP_DIR/"
