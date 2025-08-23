#!/bin/bash

# Setup Production Environment for Release Manager
set -e

echo "🏭 Setting up Release Manager Production Environment..."

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

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo "❌ .env.prod file not found!"
    echo ""
    echo "📝 Please create .env.prod with the following variables:"
    cat << EOF
# Database Configuration
DB_USER=releasemanager
DB_PASSWORD=<SECURE_PASSWORD>
DB_NAME=releasemanager
DB_HOST=postgres
DB_PORT=5432

# Keycloak Configuration
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=<SECURE_ADMIN_PASSWORD>
KEYCLOAK_REALM=releasemanager
KEYCLOAK_CLIENT_ID=release-manager-backend
KEYCLOAK_CLIENT_SECRET=<SECURE_CLIENT_SECRET>
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_HOSTNAME=<YOUR_DOMAIN_OR_IP>
KEYCLOAK_PORT=8180

# Azure Storage Configuration
AZURE_STORAGE_ACCOUNT_NAME=<YOUR_AZURE_STORAGE_ACCOUNT>
AZURE_STORAGE_ACCOUNT_KEY=<YOUR_AZURE_STORAGE_KEY>
AZURE_STORAGE_CONTAINER=releases

# Azure AD Integration (Optional)
AZURE_AD_CLIENT_ID=<YOUR_AZURE_AD_CLIENT_ID>
AZURE_AD_CLIENT_SECRET=<YOUR_AZURE_AD_CLIENT_SECRET>
AZURE_AD_TENANT_ID=<YOUR_AZURE_AD_TENANT_ID>

# Application URLs
API_URL=http://backend:8080
FRONTEND_PORT=80
BACKEND_PORT=8080
CORS_ORIGINS=http://localhost:80,https://yourdomain.com
EOF
    echo ""
    echo "⚠️  Make sure to replace <PLACEHOLDERS> with actual values!"
    exit 1
fi

echo "📋 Loading environment variables..."
set -a
source .env.prod
set +a

echo "🏗️  Building application images..."

# Build backend
echo "🔨 Building backend image..."
cd backend
podman build -t release-manager-backend:latest .
cd ..

# Build frontend
echo "🔨 Building frontend image..."
cd frontend
podman build \
    --build-arg API_URL="${API_URL}" \
    --build-arg KEYCLOAK_URL="${KEYCLOAK_URL}" \
    -t release-manager-frontend:latest .
cd ..

echo "🐳 Starting production environment..."
podman-compose -f compose.prod.yml --env-file .env.prod up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 60

# Check if services are running
echo "🔍 Checking service health..."
if podman ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(postgres|keycloak|backend|frontend)"; then
    echo "✅ All services are running"
else
    echo "❌ Some services failed to start"
    echo "🔍 Checking logs..."
    podman-compose -f compose.prod.yml logs --tail=50
    exit 1
fi

echo ""
echo "🎉 Production environment is ready!"
echo ""
echo "📋 Service URLs:"
echo "   - Frontend: http://localhost:${FRONTEND_PORT:-80}"
echo "   - Backend API: http://localhost:${BACKEND_PORT:-8080}"
echo "   - API Docs: http://localhost:${BACKEND_PORT:-8080}/q/swagger-ui/"
echo "   - Keycloak Admin: http://localhost:${KEYCLOAK_PORT:-8180} (${KEYCLOAK_ADMIN}/${KEYCLOAK_ADMIN_PASSWORD})"
echo ""
echo "🔐 Security Notes:"
echo "   - All default passwords should be changed in production"
echo "   - Configure proper SSL/TLS certificates"
echo "   - Set up proper firewall rules"
echo "   - Configure backup procedures for PostgreSQL"
echo ""
echo "📊 Monitoring:"
echo "   - Health checks are enabled for all services"
echo "   - Metrics available at: http://localhost:${BACKEND_PORT:-8080}/q/metrics"
echo ""
echo "⏹️  To stop the production environment:"
echo "   ./scripts/stop-prod.sh"