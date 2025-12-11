#!/bin/bash
set -e

# Backup script for MyInsuranceBuddies
# This script backs up the PostgreSQL database and uploads directory

# Load environment
source .env 2>/dev/null || true

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/www/myinsurancebuddies.com/backups}"
DB_NAME="${DB_NAME:-myinsurancebuddy}"
DB_USER="${DB_USER:-myuser}"
UPLOAD_DIR="${UPLOAD_DIR:-/var/www/myinsurancebuddies.com/uploads}"
RETENTION_DAYS=14
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "🔄 Starting backup at $(date)"

# Database backup
echo "📦 Backing up database: $DB_NAME"
pg_dump -U "$DB_USER" -F c -b -v -f "$BACKUP_DIR/db_${DB_NAME}_${DATE}.dump" "$DB_NAME"
gzip "$BACKUP_DIR/db_${DB_NAME}_${DATE}.dump"
echo "✓ Database backup completed: db_${DB_NAME}_${DATE}.dump.gz"

# Uploads backup
if [ -d "$UPLOAD_DIR" ]; then
  echo "📦 Backing up uploads directory"
  tar -czf "$BACKUP_DIR/uploads_${DATE}.tar.gz" -C "$(dirname "$UPLOAD_DIR")" "$(basename "$UPLOAD_DIR")"
  echo "✓ Uploads backup completed: uploads_${DATE}.tar.gz"
else
  echo "⚠ Uploads directory not found: $UPLOAD_DIR"
fi

# Clean up old backups
echo "🧹 Cleaning up backups older than $RETENTION_DAYS days"
find "$BACKUP_DIR" -name "db_*.dump.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "uploads_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Calculate backup sizes
DB_SIZE=$(du -h "$BACKUP_DIR/db_${DB_NAME}_${DATE}.dump.gz" | cut -f1)
if [ -f "$BACKUP_DIR/uploads_${DATE}.tar.gz" ]; then
  UPLOAD_SIZE=$(du -h "$BACKUP_DIR/uploads_${DATE}.tar.gz" | cut -f1)
else
  UPLOAD_SIZE="N/A"
fi

echo "✅ Backup completed successfully at $(date)"
echo "   Database: $DB_SIZE"
echo "   Uploads: $UPLOAD_SIZE"
echo "   Location: $BACKUP_DIR"

# Optional: Upload to remote backup location
# if [ -n "$REMOTE_BACKUP_HOST" ]; then
#   echo "🌐 Uploading to remote backup..."
#   rsync -avz "$BACKUP_DIR/" "$REMOTE_BACKUP_HOST:$REMOTE_BACKUP_PATH/"
#   echo "✓ Remote backup completed"
# fi
