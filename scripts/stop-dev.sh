#!/bin/bash

# Stop Development Environment for Release Manager
set -e

echo "🛑 Stopping Release Manager Development Environment..."

# Stop and remove containers
podman-compose -f compose.dev.yml down

echo "🧹 Cleaning up..."

# Optional: Remove volumes (uncomment if you want to reset data)
# echo "⚠️  Removing volumes (this will delete all data)..."
# podman volume rm release-manager-postgres-data-dev release-manager-azurite-data-dev 2>/dev/null || true

echo "✅ Development environment stopped successfully!"
echo ""
echo "💡 Tips:"
echo "   - To start again: ./scripts/setup-dev.sh"
echo "   - To remove all data: podman-compose -f compose.dev.yml down -v"