#!/bin/bash
set -e

# Restore script for MyInsuranceBuddies
# Usage: ./scripts/restore.sh <backup_file>

if [ -z "$1" ]; then
  echo "Usage: ./scripts/restore.sh <backup_file>"
  echo "Example: ./scripts/restore.sh /var/www/myinsurancebuddies.com/backups/db_myinsurancebuddy_20241211_120000.dump.gz"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

# Load environment
source .env 2>/dev/null || true

DB_NAME="${DB_NAME:-myinsurancebuddy}"
DB_USER="${DB_USER:-myuser}"

echo "⚠️  WARNING: This will replace the current database!"
echo "Database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Restore cancelled."
  exit 0
fi

echo "🔄 Starting restore at $(date)"

# Decompress if gzipped
if [[ "$BACKUP_FILE" == *.gz ]]; then
  echo "📦 Decompressing backup..."
  TEMP_FILE="/tmp/restore_$(basename "$BACKUP_FILE" .gz)"
  gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
  RESTORE_FILE="$TEMP_FILE"
else
  RESTORE_FILE="$BACKUP_FILE"
fi

# Restore database
echo "📥 Restoring database..."
pg_restore -U "$DB_USER" -d "$DB_NAME" -c -v "$RESTORE_FILE"

# Clean up temp file
if [ -n "$TEMP_FILE" ] && [ -f "$TEMP_FILE" ]; then
  rm "$TEMP_FILE"
fi

echo "✅ Restore completed successfully at $(date)"
echo "   Database: $DB_NAME restored from $BACKUP_FILE"
echo ""
echo "⚠️  Remember to restart your application:"
echo "   pm2 restart all"
