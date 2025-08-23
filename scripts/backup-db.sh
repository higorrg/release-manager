#!/bin/bash

# Backup Database for Release Manager
set -e

# Default values
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="release-manager-postgres"
DB_NAME="releasemanager"
DB_USER="releasemanager"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Creating database backup..."

# Check if container is running
if ! podman ps --format "{{.Names}}" | grep -q "$CONTAINER_NAME"; then
    echo "❌ Container $CONTAINER_NAME is not running"
    exit 1
fi

# Create backup
BACKUP_FILE="$BACKUP_DIR/releasemanager_backup_$TIMESTAMP.sql"

podman exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    echo "✅ Backup created successfully: $BACKUP_FILE"
    
    # Compress the backup
    gzip "$BACKUP_FILE"
    echo "🗜️  Backup compressed: ${BACKUP_FILE}.gz"
    
    # Show backup info
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
    echo "📊 Backup size: $BACKUP_SIZE"
    
    # Keep only the last 5 backups
    echo "🧹 Cleaning up old backups (keeping last 5)..."
    ls -t "$BACKUP_DIR"/releasemanager_backup_*.sql.gz | tail -n +6 | xargs rm -f 2>/dev/null || true
    
    echo "📋 Available backups:"
    ls -lah "$BACKUP_DIR"/releasemanager_backup_*.sql.gz 2>/dev/null || echo "   No backups found"
    
else
    echo "❌ Backup failed or file is empty"
    exit 1
fi

echo ""
echo "💡 To restore from backup:"
echo "   zcat ${BACKUP_FILE}.gz | podman exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME"