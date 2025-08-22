#!/bin/bash

# Script para notificar o Release Manager sobre uma nova versão
# Pode ser usado em qualquer pipeline de CI/CD

set -e

# Configurações
RELEASE_MANAGER_URL=${RELEASE_MANAGER_URL:-"http://localhost:8081"}
API_ENDPOINT="${RELEASE_MANAGER_URL}/api/pipeline/v1/releases"

# Parâmetros obrigatórios
PRODUCT_NAME=${PRODUCT_NAME:-""}
VERSION=${VERSION:-""}

# Função para exibir ajuda
show_help() {
    cat << EOF
Script para notificar o Release Manager sobre uma nova versão

Uso: $0 [opções]

Opções:
    -p, --product       Nome do produto (obrigatório)
    -v, --version       Versão da release (obrigatório)
    -u, --url          URL do Release Manager (padrão: http://localhost:8081)
    -h, --help         Exibir esta ajuda

Variáveis de ambiente:
    RELEASE_MANAGER_URL    URL base do Release Manager
    PRODUCT_NAME          Nome do produto
    VERSION              Versão da release

Exemplos:
    $0 -p "Sistema Principal" -v "1.2.3"
    
    PRODUCT_NAME="Sistema Principal" VERSION="1.2.3" $0
    
    # Em GitLab CI
    PRODUCT_NAME="Sistema Principal" VERSION="\$CI_COMMIT_TAG" $0
    
    # Em Jenkins
    PRODUCT_NAME="Sistema Principal" VERSION="\$TAG_NAME" $0
    
    # Em GitHub Actions
    PRODUCT_NAME="Sistema Principal" VERSION="\${{ github.ref_name }}" $0

EOF
}

# Parse dos argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--product)
            PRODUCT_NAME="$2"
            shift 2
            ;;
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        -u|--url)
            RELEASE_MANAGER_URL="$2"
            API_ENDPOINT="${RELEASE_MANAGER_URL}/api/pipeline/v1/releases"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Opção desconhecida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Validações
if [[ -z "$PRODUCT_NAME" ]]; then
    echo "Erro: Nome do produto é obrigatório"
    echo "Use -p ou defina a variável PRODUCT_NAME"
    exit 1
fi

if [[ -z "$VERSION" ]]; then
    echo "Erro: Versão é obrigatória"
    echo "Use -v ou defina a variável VERSION"
    exit 1
fi

# Verificar se curl está disponível
if ! command -v curl &> /dev/null; then
    echo "Erro: curl não está instalado"
    exit 1
fi

# Verificar se jq está disponível (opcional, para melhor formatação)
JQ_AVAILABLE=false
if command -v jq &> /dev/null; then
    JQ_AVAILABLE=true
fi

echo "=== Notificando Release Manager ==="
echo "URL: $API_ENDPOINT"
echo "Produto: $PRODUCT_NAME"
echo "Versão: $VERSION"
echo ""

# Preparar payload JSON
PAYLOAD=$(cat <<EOF
{
    "productName": "$PRODUCT_NAME",
    "version": "$VERSION"
}
EOF
)

echo "Payload:"
if $JQ_AVAILABLE; then
    echo "$PAYLOAD" | jq .
else
    echo "$PAYLOAD"
fi
echo ""

# Fazer a requisição
echo "Enviando notificação..."
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
    -X POST "$API_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD")

# Extrair código HTTP e resposta
HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
RESPONSE_BODY=$(echo "$RESPONSE" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')

echo "Status HTTP: $HTTP_STATUS"

# Verificar resultado
case $HTTP_STATUS in
    200|201)
        echo "✅ Release registrada com sucesso!"
        if [[ -n "$RESPONSE_BODY" ]] && $JQ_AVAILABLE; then
            echo "Resposta:"
            echo "$RESPONSE_BODY" | jq .
        elif [[ -n "$RESPONSE_BODY" ]]; then
            echo "Resposta: $RESPONSE_BODY"
        fi
        exit 0
        ;;
    400)
        echo "❌ Erro de validação (400 Bad Request)"
        if [[ -n "$RESPONSE_BODY" ]]; then
            echo "Erro: $RESPONSE_BODY"
        fi
        exit 1
        ;;
    401)
        echo "❌ Não autorizado (401 Unauthorized)"
        echo "Verifique se a autenticação está configurada corretamente"
        exit 1
        ;;
    404)
        echo "❌ Endpoint não encontrado (404 Not Found)"
        echo "Verifique se a URL está correta: $API_ENDPOINT"
        exit 1
        ;;
    500)
        echo "❌ Erro interno do servidor (500 Internal Server Error)"
        if [[ -n "$RESPONSE_BODY" ]]; then
            echo "Erro: $RESPONSE_BODY"
        fi
        exit 1
        ;;
    000)
        echo "❌ Não foi possível conectar ao Release Manager"
        echo "Verifique se o serviço está rodando em: $RELEASE_MANAGER_URL"
        exit 1
        ;;
    *)
        echo "❌ Erro inesperado (HTTP $HTTP_STATUS)"
        if [[ -n "$RESPONSE_BODY" ]]; then
            echo "Resposta: $RESPONSE_BODY"
        fi
        exit 1
        ;;
esac