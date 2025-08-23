#!/bin/bash

# Setup Development Environment for Release Manager
set -e

echo "🚀 Setting up Release Manager Development Environment..."

# Check if podman-compose is available
if ! command -v podman-compose &> /dev/null; then
    echo "❌ podman-compose is not installed. Please install it first."
    echo "   Install with: pip install podman-compose"
    exit 1
fi

# Check if podman is available
if ! command -v podman &> /dev/null; then
    echo "❌ Podman is not installed. Please install it first."
    exit 1
fi

# Create .env file for development if it doesn't exist
if [ ! -f .env.dev ]; then
    echo "📝 Creating .env.dev file..."
    cat > .env.dev << EOF
# Database Configuration
DB_USER=releasemanager
DB_PASSWORD=releasemanager123
DB_NAME=releasemanager
DB_HOST=localhost
DB_PORT=5432

# Keycloak Configuration
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin123
KEYCLOAK_REALM=releasemanager
KEYCLOAK_CLIENT_ID=release-manager-backend
KEYCLOAK_CLIENT_SECRET=secret
KEYCLOAK_URL=http://localhost:8180

# Azure Storage (Development - using Azurite)
AZURE_STORAGE_ACCOUNT_NAME=devstorageaccount1
AZURE_STORAGE_ACCOUNT_KEY=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
AZURE_STORAGE_CONTAINER=releases

# CORS Origins
CORS_ORIGINS=http://localhost:4200
EOF
    echo "✅ .env.dev file created"
fi

# Start infrastructure services
echo "🐳 Starting infrastructure services..."
podman-compose -f compose.dev.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."
if podman ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(postgres|keycloak|azurite)"; then
    echo "✅ Infrastructure services are running"
else
    echo "❌ Some services failed to start"
    exit 1
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📋 Service URLs:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Keycloak Admin: http://localhost:8180 (admin/admin123)"
echo "   - Azurite (Blob Storage): localhost:10000"
echo ""
echo "🚀 Next steps:"
echo "   1. Start the backend:"
echo "      cd backend && mvn quarkus:dev"
echo ""
echo "   2. Start the frontend:"
echo "      cd frontend && npm install && npm start"
echo ""
echo "   3. Access the application:"
echo "      - Frontend: http://localhost:4200"
echo "      - Backend API: http://localhost:8080"
echo "      - API Docs: http://localhost:8080/q/swagger-ui/"
echo ""
echo "👥 Test Users:"
echo "   - admin / admin123 (Administrator)"
echo "   - release.manager / manager123 (Release Manager)"
echo "   - qa.analyst / qa123 (QA Analyst)"
echo "   - developer / dev123 (Developer)"
echo "   - pipeline / pipeline123 (Pipeline/System)"
echo ""
echo "⏹️  To stop the development environment:"
echo "   ./scripts/stop-dev.sh"