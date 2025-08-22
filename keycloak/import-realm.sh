#!/bin/bash

# Script para importar o realm do Release Manager no Keycloak

KEYCLOAK_URL=${KEYCLOAK_URL:-"http://localhost:8080"}
ADMIN_USER=${KEYCLOAK_ADMIN:-"admin"}
ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD:-"admin"}

echo "=== Importando Realm Release Manager ==="
echo "Keycloak URL: $KEYCLOAK_URL"
echo "Admin User: $ADMIN_USER"

# Aguardar o Keycloak estar disponível
echo "Aguardando Keycloak estar disponível..."
until curl -s "$KEYCLOAK_URL/health/ready" > /dev/null; do
  echo "Keycloak não está pronto. Aguardando..."
  sleep 5
done

echo "Keycloak está disponível!"

# Obter token de admin
echo "Obtendo token de administração..."
ADMIN_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$ADMIN_USER" \
  -d "password=$ADMIN_PASSWORD" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

if [ "$ADMIN_TOKEN" = "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo "Erro: Não foi possível obter token de administração"
  exit 1
fi

echo "Token obtido com sucesso!"

# Verificar se o realm já existe
REALM_EXISTS=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
  "$KEYCLOAK_URL/admin/realms/release-manager" | jq -r '.realm')

if [ "$REALM_EXISTS" = "release-manager" ]; then
  echo "Realm 'release-manager' já existe. Atualizando..."
  # Atualizar realm existente
  curl -s -X PUT "$KEYCLOAK_URL/admin/realms/release-manager" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d @/opt/keycloak/realm-config/release-manager-realm.json
else
  echo "Criando novo realm 'release-manager'..."
  # Criar novo realm
  curl -s -X POST "$KEYCLOAK_URL/admin/realms" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d @/opt/keycloak/realm-config/release-manager-realm.json
fi

echo "=== Configuração do Realm Release Manager concluída ==="

# Criar usuários de exemplo para desenvolvimento
echo "Criando usuários de exemplo para desenvolvimento..."

# Usuário Admin
curl -s -X POST "$KEYCLOAK_URL/admin/realms/release-manager/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "enabled": true,
    "firstName": "Administrador",
    "lastName": "Sistema",
    "email": "admin@releasemanager.local",
    "credentials": [{
      "type": "password",
      "value": "admin123",
      "temporary": false
    }],
    "realmRoles": ["admin"],
    "groups": ["/Administrators"]
  }'

# Usuário Release Manager
curl -s -X POST "$KEYCLOAK_URL/admin/realms/release-manager/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "release.manager",
    "enabled": true,
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao.silva@releasemanager.local",
    "credentials": [{
      "type": "password",
      "value": "manager123",
      "temporary": false
    }],
    "realmRoles": ["release-manager"],
    "groups": ["/Release Managers"]
  }'

# Usuário Viewer
curl -s -X POST "$KEYCLOAK_URL/admin/realms/release-manager/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "viewer",
    "enabled": true,
    "firstName": "Maria",
    "lastName": "Santos",
    "email": "maria.santos@releasemanager.local",
    "credentials": [{
      "type": "password",
      "value": "viewer123",
      "temporary": false
    }],
    "realmRoles": ["viewer"],
    "groups": ["/Viewers"]
  }'

echo "Usuários de exemplo criados:"
echo "  - admin / admin123 (Administrador)"
echo "  - release.manager / manager123 (Gestor de Release)"
echo "  - viewer / viewer123 (Visualizador)"

echo "=== Importação concluída com sucesso! ==="