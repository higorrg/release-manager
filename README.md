# Release Manager

Sistema de gerenciamento de releases desenvolvido com **Quarkus** (backend) e **Angular 18** (frontend), utilizando autenticação via **Keycloak** integrado ao **Azure AD**.

## 🏗️ Arquitetura

### Backend (Quarkus + Java 21)
- **Arquitetura Hexagonal** com package-by-feature
- **PostgreSQL 17** como banco de dados
- **Keycloak** para autenticação e autorização
- **Azure Blob Storage** para armazenamento de pacotes
- **Flyway** para versionamento do banco de dados

### Frontend (Angular 18)
- **Standalone Components**
- **Signals** para gerenciamento de estado
- **Reactive Forms**
- **Keycloak-js** para integração com autenticação

## 🚀 Funcionalidades

- **Autenticação via SSO** (Keycloak + Azure AD)
- **Controle de status** das etapas de release
- **Histórico de mudanças** de status
- **Criação automática** de releases via pipeline
- **Upload de pacotes** para Azure Blob Storage
- **Relacionamento** de releases com clientes e ambientes
- **API para listar versões** disponíveis

## 🛠️ Tecnologias

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| **Backend** | Java | 21 |
| | Quarkus | 3.24.3 |
| | PostgreSQL | 17 |
| **Frontend** | Angular | 18 |
| | TypeScript | 5.5 |
| | Node.js | 20+ |
| **Autenticação** | Keycloak | 24.0 |
| **Containers** | Docker | Latest |
| **Storage** | Azure Blob | Latest |

## 📋 Pré-requisitos

- **Docker** e **Docker Compose**
- **Java 21** (para desenvolvimento)
- **Node.js 20+** (para desenvolvimento)
- **Maven 3.9+** (para build do backend)

## 🚀 Como Executar

### Ambiente de Desenvolvimento

1. **Clone o repositório**
```bash
git clone <repository-url>
cd release-manager
```

2. **Configure as variáveis de ambiente**
```bash
export AZURE_STORAGE_CONNECTION_STRING="sua-connection-string-aqui"
export AZURE_STORAGE_CONTAINER_NAME="releases"
```

3. **Inicie os serviços de infraestrutura**
```bash
docker-compose up -d postgres keycloak
```

4. **Configure o Keycloak**
   - Acesse: http://localhost:8080
   - Login: admin/admin123
   - O realm será importado automaticamente

5. **Execute o Backend**
```bash
cd backend
./mvnw compile quarkus:dev
```

6. **Execute o Frontend**
```bash
cd frontend
npm install
npm start
```

7. **Acesse a aplicação**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8081
   - Keycloak: http://localhost:8080

### Ambiente de Produção

```bash
# Configure as variáveis de ambiente no docker-compose-prod.yml
docker-compose -f docker-compose-prod.yml up -d
```

## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `AZURE_STORAGE_CONNECTION_STRING` | String de conexão Azure Storage | ✅ |
| `AZURE_STORAGE_CONTAINER_NAME` | Nome do container | ❌ (padrão: releases) |
| `DB_USER` | Usuário do PostgreSQL | ❌ (padrão: admin) |
| `DB_PASSWORD` | Senha do PostgreSQL | ❌ (padrão: admin123) |
| `KEYCLOAK_ADMIN_PASSWORD` | Senha do admin Keycloak | ❌ (padrão: admin123) |

### Configuração do Azure Blob Storage

#### **1. Criar Storage Account**
1. Acesse https://portal.azure.com
2. **Create a resource** → **Storage Account**
3. Configure:
   - **Storage account name**: nome único (ex: `releasemanagerstorage`)
   - **Performance**: Standard
   - **Redundancy**: LRS
4. **Create**

#### **2. Obter Connection String**
1. **Storage Account** → **Access keys**
2. **Show** na **Connection string** da **key1**
3. **Copie** a string completa

#### **3. Configurar Acesso Público**

**Via Azure CLI (Recomendado):**
```bash
# 1. Descobrir resource group
RESOURCE_GROUP=$(az storage account list --query "[?name=='releasemanagerstorage'].resourceGroup" --output tsv)

# 2. Habilitar acesso público no storage account
az storage account update \
  --name releasemanagerstorage \
  --resource-group $RESOURCE_GROUP \
  --allow-blob-public-access true

# 3. Configurar container para URLs públicas
az storage container set-permission \
  --name releases \
  --public-access blob \
  --account-name releasemanagerstorage
```

**Via Portal do Azure:**
1. **Storage Account** → **Configuration** → **Allow Blob public access**: **Enabled** → **Save**
2. **Containers** → **releases** → **Change access level** → **Blob** → **OK**

### Configuração do Azure AD

1. **No Azure Portal**, crie uma aplicação
2. **Configure as URLs de redirect** no Keycloak
3. **Atualize o arquivo** `keycloak/realm-export.json` com:
   - `clientId`: ID da aplicação Azure
   - `clientSecret`: Secret da aplicação Azure
   - `issuer`: Tenant do Azure AD

## 🧪 Testes

### Backend
```bash
cd backend
./mvnw test
```

### Frontend
```bash
cd frontend
npm test
```

## 🔄 Integração com Pipelines CI/CD

### **Pipeline Completa - Criar Release + Upload**

**GitHub Actions:**
```yaml
name: Deploy Release

on:
  push:
    tags: 
      - 'v*.*.*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Extract version
        id: version
        run: echo "VERSION=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT
      
      - name: Create Release and Upload Package
        env:
          KEYCLOAK_URL: ${{ secrets.KEYCLOAK_URL }}
          API_URL: ${{ secrets.API_URL }}
          CLIENT_SECRET: ${{ secrets.CLIENT_SECRET }}
          ADMIN_USER: ${{ secrets.ADMIN_USER }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
          PRODUCT_NAME: ${{ secrets.PRODUCT_NAME }}
        run: |
          # 1. Obter token de autenticação
          TOKEN=$(curl -s -X POST $KEYCLOAK_URL/realms/release-manager/protocol/openid-connect/token \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -d "grant_type=password" \
            -d "client_id=release-manager-backend" \
            -d "client_secret=$CLIENT_SECRET" \
            -d "username=$ADMIN_USER" \
            -d "password=$ADMIN_PASSWORD" | jq -r .access_token)
          
          # 2. Criar release
          curl -X POST $API_URL/api/v1/releases/pipeline \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"productName\": \"$PRODUCT_NAME\", \"version\": \"${{ steps.version.outputs.VERSION }}\"}"
          
          # 3. Upload do pacote (usando produto e versão)
          curl -X POST "$API_URL/api/v1/releases/upload/$PRODUCT_NAME/${{ steps.version.outputs.VERSION }}" \
            -H "Authorization: Bearer $TOKEN" \
            -F "file=@dist/package.zip"
```

**GitLab CI:**
```yaml
deploy:
  stage: deploy
  only:
    - tags
  script:
    # 1. Obter token
    - |
      TOKEN=$(curl -s -X POST $KEYCLOAK_URL/realms/release-manager/protocol/openid-connect/token \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=password" \
        -d "client_id=release-manager-backend" \
        -d "client_secret=$CLIENT_SECRET" \
        -d "username=$ADMIN_USER" \
        -d "password=$ADMIN_PASSWORD" | jq -r .access_token)
    
    # 2. Criar release
    - |
      curl -X POST $API_URL/api/v1/releases/pipeline \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"productName\": \"$PRODUCT_NAME\", \"version\": \"$CI_COMMIT_TAG\"}"
    
    # 3. Upload do pacote
    - |
      curl -X POST "$API_URL/api/v1/releases/upload/$PRODUCT_NAME/$CI_COMMIT_TAG" \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@dist/package.zip"
```

### **Comandos Individuais**

**1. Criar Release:**
```bash
# Obter token
TOKEN=$(curl -s -X POST http://localhost:8080/realms/release-manager/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=release-manager-backend" \
  -d "client_secret=backend-client-secret" \
  -d "username=admin" \
  -d "password=admin123" | jq -r .access_token)

# Criar release
curl -X POST http://localhost:8081/api/v1/releases/pipeline \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productName": "MeuProduto", "version": "8.5.0"}'
```

**2. Upload de Pacote (Novo - Recomendado):**
```bash
# Upload usando produto e versão (mais fácil para pipelines)
curl -X POST "http://localhost:8081/api/v1/releases/upload/MeuProduto/8.5.0" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@package.zip"
```

**3. Upload de Pacote (Antigo - Por ID):**
```bash
# Upload usando ID da release (compatibilidade)
curl -X POST "http://localhost:8081/api/v1/releases/RELEASE_ID/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@package.zip"
```

### **Variáveis de Ambiente Necessárias:**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `KEYCLOAK_URL` | URL base do Keycloak | `http://localhost:8080` |
| `API_URL` | URL base da API | `http://localhost:8081` |
| `CLIENT_SECRET` | Secret do cliente backend | `backend-client-secret` |
| `ADMIN_USER` | Usuário administrador | `admin` |
| `ADMIN_PASSWORD` | Senha do administrador | `admin123` |
| `PRODUCT_NAME` | Nome do produto | `MeuProduto` |

## 📊 API Documentation

**Swagger UI:** http://localhost:8081/q/swagger-ui

A documentação completa da API está disponível via Swagger, incluindo todos os endpoints para:
- Criação e gerenciamento de releases
- Upload de pacotes
- Controle de status
- Histórico de mudanças
- Associação com clientes e ambientes

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.