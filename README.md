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
| **Containers** | Podman | Latest |
| **Storage** | Azure Blob | Latest |

## 📋 Pré-requisitos

**Para Desenvolvimento:**
- **Java 21** (OpenJDK ou Oracle)
- **Maven 3.9+** 
- **Node.js 20+** e **npm 9+**
- **Podman 4+** e **Podman Compose 1+**

**Para Produção:**
- **Podman 4+** e **Podman Compose 1+**
- **Memória RAM**: 4GB mínimo, 8GB recomendado
- **Espaço em Disco**: 2GB para builds + 1GB para containers

**Verificar Instalação:**
```bash
java -version        # Java 21
mvn -version         # Maven 3.9+
node -version        # Node 20+
npm -version         # npm 9+
podman -version      # Podman 4+
podman-compose -version  # Compose 1+
```

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
podman-compose up -d postgres keycloak
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
podman-compose -f docker-compose-prod.yml up -d
```

## 🏗️ Compilação da Stack

### **Build Completo - Produção**

**1. Compilar Backend:**
```bash
cd backend
./mvnw clean package -DskipTests
```

**2. Compilar Frontend:**
```bash
cd frontend
npm install
npm run build
```

**3. Build das Imagens Podman:**
```bash
# Backend (Quarkus JVM)
cd backend
podman build -f src/main/docker/Dockerfile.jvm -t release-manager-backend .

# Frontend (Angular + Nginx)
cd frontend
podman build -t release-manager-frontend .
```

**4. Executar Stack Completa:**
```bash
# Subir toda a stack em produção
podman-compose -f docker-compose-prod.yml up -d
```

### **Build de Desenvolvimento**

**1. Compilar Backend (modo desenvolvimento):**
```bash
cd backend
./mvnw compile quarkus:dev
# Servidor inicia em http://localhost:8081
```

**2. Compilar Frontend (modo desenvolvimento):**
```bash
cd frontend
npm install
npm start
# Servidor inicia em http://localhost:4200
```

**3. Executar Infraestrutura:**
```bash
# Apenas banco e Keycloak para desenvolvimento
podman-compose up -d postgres keycloak
```

### **Scripts Úteis**

**Build e Test Completo:**
```bash
# Backend - compilação e testes
cd backend
./mvnw clean compile test

# Frontend - build e testes
cd frontend
npm install
npm run build
npm test
```

**Limpeza do Ambiente:**
```bash
# Limpar containers
podman-compose down -v

# Limpar builds
cd backend && ./mvnw clean
cd frontend && rm -rf dist/ node_modules/

# Rebuild completo
cd backend && ./mvnw clean package
cd frontend && npm install && npm run build
```

**Verificar Saúde da Aplicação:**
```bash
# Backend health check
curl http://localhost:8081/q/health

# Frontend (após build)
curl http://localhost:4200

# Keycloak
curl http://localhost:8080/health
```

### **Build para CI/CD**

**GitHub Actions / GitLab CI:**
```bash
# Backend - Compilação para produção
cd backend
./mvnw clean package -DskipTests
podman build -f src/main/docker/Dockerfile.jvm -t $REGISTRY/release-manager-backend:$VERSION .

# Frontend - Build otimizado
cd frontend
npm ci
npm run build --prod
podman build -t $REGISTRY/release-manager-frontend:$VERSION .

# Push das imagens
podman push $REGISTRY/release-manager-backend:$VERSION
podman push $REGISTRY/release-manager-frontend:$VERSION
```


### **Troubleshooting**

**Problemas Comuns de Build:**

```bash
# 1. Erro de memória no Maven
export MAVEN_OPTS="-Xmx2048m"
./mvnw clean package

# 2. Erro de porta ocupada
lsof -ti:8080 | xargs kill -9  # Keycloak
lsof -ti:8081 | xargs kill -9  # Backend
lsof -ti:4200 | xargs kill -9  # Frontend

# 3. Cache corrompido
./mvnw dependency:purge-local-repository
rm -rf frontend/node_modules frontend/dist
npm install

# 4. Configuração Podman (Linux)
# Podman não requer configurações especiais de grupo

# 5. Limpar completamente e rebuildar
podman-compose down -v
podman system prune -f
./mvnw clean && npm run clean
./mvnw package && npm run build
```

**Logs para Debug:**
```bash
# Backend logs
podman-compose logs backend

# Frontend logs
podman-compose logs frontend

# Keycloak logs
podman-compose logs keycloak

# PostgreSQL logs
podman-compose logs postgres
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

### Backend - Execução Simplificada

O projeto está configurado para separação automática entre testes unitários e de integração:

**Executar apenas testes unitários:**
```bash
cd backend
./mvnw test
```

**Executar apenas testes de integração:**
```bash
cd backend
./mvnw failsafe:integration-test
# ou
./mvnw integration-test
```

**Executar todos os testes (unitários + integração):**
```bash
cd backend
./mvnw verify
```

**Estrutura dos Testes:**
- **Testes Unitários**: `src/test/java/` (padrão `*Test.java`, `Test*.java`)
- **Testes de Integração**: `src/it/java/` (padrão `*IT.java`, `IT*.java`)
- **TestContainers**: PostgreSQL 17-alpine em container isolado
- **Configuração**: Desabilita OIDC e usa autenticação basic para testes

### Relatórios de Cobertura JaCoCo

**Gerar relatórios de cobertura:**
```bash
cd backend

# Cobertura apenas dos testes unitários
./mvnw test jacoco:report

# Cobertura apenas dos testes de integração
./mvnw integration-test jacoco:report-integration

# Cobertura completa (unitários + integração)
./mvnw verify
```

**Localização dos Relatórios:**
- **Testes Unitários**: `target/site/jacoco/index.html`
- **Testes de Integração**: `target/site/jacoco-it/index.html`
- **Relatório Consolidado**: `target/site/jacoco-merged/index.html`

**Abrir relatório no navegador:**
```bash
# Linux/macOS
open target/site/jacoco-merged/index.html

# Windows
start target/site/jacoco-merged/index.html
```

### Testes Frontend
```bash
cd frontend
npm test
```

### CI/CD - Testes Automatizados
```bash
# Pipeline completa com testes e cobertura
cd backend
./mvnw clean verify

cd frontend  
npm ci
npm run test:ci
npm run build
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