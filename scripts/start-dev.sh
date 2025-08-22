#!/bin/bash

# Script para iniciar o ambiente de desenvolvimento

set -e

echo "=== Iniciando Ambiente de Desenvolvimento Release Manager ==="

# Verificar se podman está disponível
if ! command -v podman &> /dev/null; then
    echo "Erro: Podman não está instalado"
    echo "Por favor, instale o Podman primeiro"
    exit 1
fi

if ! command -v podman-compose &> /dev/null; then
    echo "Erro: Podman Compose não está instalado"
    echo "Por favor, instale o Podman Compose primeiro"
    exit 1
fi

# Parar containers existentes se houver
echo "Parando containers existentes..."
podman-compose -f docker-compose.dev.yml down --remove-orphans || true

# Iniciar infraestrutura
echo "Iniciando infraestrutura (PostgreSQL, Keycloak, Azurite)..."
podman-compose -f docker-compose.dev.yml up -d

# Aguardar setup completar
echo "Aguardando setup automático completar..."
sleep 10

# Verificar se os serviços estão rodando
echo "Verificando serviços..."

max_attempts=30
attempt=0

# Verificar PostgreSQL
until podman exec release-manager-postgres-dev pg_isready -U release_manager -d release_manager > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -gt $max_attempts ]; then
        echo "Erro: PostgreSQL não ficou disponível"
        exit 1
    fi
    echo "Aguardando PostgreSQL... ($attempt/$max_attempts)"
    sleep 2
done

echo "✅ PostgreSQL está rodando"

# Verificar Keycloak
attempt=0
until curl -s http://localhost:8080/health/ready > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -gt $max_attempts ]; then
        echo "Erro: Keycloak não ficou disponível"
        exit 1
    fi
    echo "Aguardando Keycloak... ($attempt/$max_attempts)"
    sleep 5
done

echo "✅ Keycloak está rodando"

# Verificar Azurite
attempt=0
until curl -s http://localhost:10000/ > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -gt $max_attempts ]; then
        echo "Erro: Azurite não ficou disponível"
        exit 1
    fi
    echo "Aguardando Azurite... ($attempt/$max_attempts)"
    sleep 2
done

echo "✅ Azurite está rodando"

# Aguardar setup completar
echo "Aguardando setup de realm completar..."
sleep 15

echo ""
echo "🎉 Ambiente de desenvolvimento iniciado com sucesso!"
echo ""
echo "Serviços disponíveis:"
echo "  📊 PostgreSQL: localhost:5432"
echo "     Database: release_manager"
echo "     User: release_manager / release_manager"
echo ""
echo "  🔐 Keycloak: http://localhost:8080"
echo "     Admin: http://localhost:8080/admin (admin / admin)"
echo "     Realm: release-manager"
echo ""
echo "  🗄️  Azurite: http://localhost:10000"
echo "     Container 'releases' criado automaticamente"
echo ""
echo "Usuários de desenvolvimento:"
echo "  👤 admin / admin123 (Administrador)"
echo "  👤 release.manager / manager123 (Gestor de Release)"
echo "  👤 viewer / viewer123 (Visualizador)"
echo ""
echo "Próximos passos:"
echo "  1. Iniciar backend: cd backend && ./mvnw quarkus:dev"
echo "  2. Iniciar frontend: cd frontend && npm install && npm start"
echo ""
echo "Para parar: podman-compose -f docker-compose.dev.yml down"