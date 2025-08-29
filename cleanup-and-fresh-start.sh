#!/usr/bin/env bash
# Release Manager Application Stack Cleanup Script
# This script stops all containers and removes volumes for a fresh restart

echo "🧹 Starting Release Manager cleanup..."

# Navigate to project directory
cd ~/workspace/release-manager || exit

# Stop all containers using podman-compose
echo "📦 Stopping all containers..."
podman-compose down

# List and remove all release-manager related containers (if any are still running)
echo "🗑️  Removing any remaining release-manager containers..."
podman ps -a --filter "name=release-manager" --format "{{.Names}}" | xargs -r podman rm -f

# Remove all release-manager related volumes
echo "💾 Removing all release-manager volumes..."
podman volume ls --filter "name=release-manager" --format "{{.Name}}" | xargs -r podman volume rm -f

# Remove the release-manager network
echo "🌐 Removing release-manager network..."
podman network rm release-manager-network 2>/dev/null || echo "Network not found or already removed"

# Optional: Remove specific volumes by name if they exist
echo "🔍 Removing specific volumes if they exist..."
podman volume rm release-manager_postgres_data_v1 2>/dev/null || echo "postgres-data volume not found"

echo "✅ Cleanup complete!"
