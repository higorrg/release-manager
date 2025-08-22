#!/bin/sh

# Script de setup para ambiente de desenvolvimento

echo "=== Setup do Ambiente de Desenvolvimento ==="

# Aguardar Keycloak estar pronto
echo "Aguardando Keycloak estar disponível..."
until curl -s http://keycloak:8080/health/ready > /dev/null; do
  echo "Keycloak não está pronto. Aguardando..."
  sleep 5
done

echo "Keycloak está disponível!"

# Executar importação do realm
echo "Executando importação do realm..."
KEYCLOAK_URL="http://keycloak:8080" \
KEYCLOAK_ADMIN="admin" \
KEYCLOAK_ADMIN_PASSWORD="admin" \
sh /setup/import-realm.sh

# Aguardar Azurite estar pronto
echo "Aguardando Azurite estar disponível..."
until curl -s http://azurite:10000/ > /dev/null; do
  echo "Azurite não está pronto. Aguardando..."
  sleep 2
done

echo "Azurite está disponível!"

# Criar container 'releases' no Azurite
echo "Criando container 'releases' no Azurite..."
curl -X PUT "http://azurite:10000/devstoreaccount1/releases?restype=container" \
  -H "x-ms-version: 2020-04-08" \
  -H "Authorization: SharedKey devstoreaccount1:Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=="

echo "=== Setup do Desenvolvimento Concluído ==="
echo ""
echo "Serviços disponíveis:"
echo "  - PostgreSQL: localhost:5432"
echo "    - Database: release_manager"
echo "    - User: release_manager"
echo "    - Password: release_manager"
echo ""
echo "  - Keycloak: http://localhost:8080"
echo "    - Admin Console: http://localhost:8080/admin"
echo "    - Admin User: admin / admin"
echo "    - Realm: release-manager"
echo ""
echo "  - Azurite (Azure Storage Emulator): http://localhost:10000"
echo "    - Connection String: DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;"
echo ""
echo "Usuários de desenvolvimento criados:"
echo "  - admin / admin123 (Administrador)"
echo "  - release.manager / manager123 (Gestor de Release)"
echo "  - viewer / viewer123 (Visualizador)"
echo ""
echo "Para iniciar o backend: cd backend && ./mvnw quarkus:dev"
echo "Para iniciar o frontend: cd frontend && npm start"