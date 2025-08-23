#!/bin/bash

# Stop Production Environment for Release Manager
set -e

echo "🛑 Stopping Release Manager Production Environment..."

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo "❌ .env.prod file not found!"
    echo "   Using default compose file without environment variables"
    podman-compose -f compose.prod.yml down
else
    # Stop and remove containers
    podman-compose -f compose.prod.yml --env-file .env.prod down
fi

echo "🧹 Cleaning up dangling images..."
podman image prune -f 2>/dev/null || true

echo "✅ Production environment stopped successfully!"
echo ""
echo "💡 Tips:"
echo "   - To start again: ./scripts/setup-prod.sh"
echo "   - To remove all data: podman-compose -f compose.prod.yml down -v"
echo "   - To backup data before cleanup: podman run --rm -v release-manager_postgres_data:/data -v \$PWD:/backup alpine tar czf /backup/postgres-backup.tar.gz /data"