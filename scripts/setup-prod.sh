#!/bin/sh

# Script de setup para ambiente de produção

echo "=== Setup do Ambiente de Produção ==="

# Aguardar Keycloak estar pronto
echo "Aguardando Keycloak estar disponível..."
max_attempts=60
attempt=0

until curl -s http://keycloak:8080/health/ready > /dev/null; do
  attempt=$((attempt + 1))
  if [ $attempt -gt $max_attempts ]; then
    echo "Erro: Keycloak não ficou disponível após $max_attempts tentativas"
    exit 1
  fi
  echo "Keycloak não está pronto. Tentativa $attempt/$max_attempts..."
  sleep 10
done

echo "Keycloak está disponível!"

# Executar importação do realm
echo "Executando importação do realm para produção..."
sh /setup/import-realm.sh

echo "=== Setup de Produção Concluído ==="
echo ""
echo "IMPORTANTE: Para ambiente de produção:"
echo "1. Configure HTTPS com certificados SSL válidos"
echo "2. Use senhas seguras para todos os serviços"
echo "3. Configure backup automático do banco de dados"
echo "4. Configure monitoramento e logs"
echo "5. Atualize as URLs do Azure AD no Keycloak"
echo ""
echo "Serviços em execução:"
echo "  - Database: Internal PostgreSQL"
echo "  - Keycloak: http://keycloak:8080 (interno)"
echo "  - Backend: http://backend:8081 (interno)"
echo "  - Frontend: http://frontend:80 (interno)"