# Release Manager

Sistema de gerenciamento de releases desenvolvido com **Quarkus** (backend) e **Angular 20** (frontend), utilizando autenticação via **Keycloak** integrado ao **Azure AD**.

## 🏗️ Arquitetura

### Backend (Quarkus + Java 21)
- **Arquitetura Hexagonal** com package-by-feature
- **PostgreSQL 17** como banco de dados
- **Keycloak** para autenticação e autorização
- **Azure Blob Storage** para armazenamento de pacotes
- **Flyway** para versionamento do banco de dados

### Frontend (Angular 20)
- **Standalone Components**
- **Signals** para gerenciamento de estado
- **Reactive Forms**
- **Keycloak-js** para integração com autenticação

## 🚀 Funcionalidades

### ✅ Implementadas

- **US-01**: Autenticação via SSO (Keycloak + Azure AD)
- **US-02**: Controle de status das etapas de release
- **US-03**: Registro de histórico de mudanças de status
- **US-05**: Criação automática de releases via pipeline

### 🚧 Em Desenvolvimento

- **US-04**: Relacionamento de releases com clientes e ambientes
- **US-06**: API para listar versões disponíveis
- **US-07**: Download de pacotes instaláveis

## 🛠️ Tecnologias

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| **Backend** | Java | 21 |
| | Quarkus | 3.9.4 |
| | PostgreSQL | 17 |
| **Frontend** | Angular | 20 |
| | TypeScript | 5.6 |
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

2. **Inicie os serviços de infraestrutura**
```bash
docker-compose up -d postgres keycloak
```

3. **Configure o Keycloak**
   - Acesse: http://localhost:8080
   - Login: admin/admin123
   - O realm será importado automaticamente

4. **Execute o Backend**
```bash
cd backend
./mvnw compile quarkus:dev
```

5. **Execute o Frontend**
```bash
cd frontend
npm install
npm start
```

6. **Acesse a aplicação**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8081
   - Keycloak: http://localhost:8080

### Ambiente de Produção

```bash
# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute todos os serviços
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DB_USER` | Usuário do PostgreSQL | admin |
| `DB_PASSWORD` | Senha do PostgreSQL | admin123 |
| `KEYCLOAK_ADMIN_PASSWORD` | Senha do admin Keycloak | admin123 |
| `OIDC_CLIENT_SECRET` | Secret do cliente backend | backend-client-secret |
| `AZURE_STORAGE_CONNECTION_STRING` | String de conexão Azure Storage | - |
| `API_BASE_URL` | URL base da API | http://backend:8080 |

### Configuração do Azure AD

1. **No Azure Portal**, crie uma aplicação
2. **Configure as URLs de redirect** no Keycloak
3. **Atualize o arquivo** `keycloak/realm-export.json` com:
   - `clientId`: ID da aplicação Azure
   - `clientSecret`: Secret da aplicação Azure
   - `issuer`: Tenant do Azure AD

## 📁 Estrutura do Projeto

```
release-manager/
├── backend/                    # API Quarkus
│   ├── src/main/java/com/empresa/app/
│   │   └── release/           # Feature de releases
│   │       ├── domain/        # Modelos de domínio
│   │       ├── application/   # Casos de uso e ports
│   │       └── adapter/       # Adaptadores (REST, JPA)
│   └── src/main/resources/
│       ├── application.properties
│       └── db/migration/      # Scripts Flyway
├── frontend/                  # Aplicação Angular
│   ├── src/app/
│   │   ├── core/             # Serviços e guards
│   │   └── features/         # Componentes por feature
│   └── nginx.conf
├── keycloak/                 # Configuração Keycloak
│   └── realm-export.json
├── database/                 # Scripts de banco
│   └── init.sql
├── docker-compose.yml        # Desenvolvimento
└── docker-compose.prod.yml   # Produção
```

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

## 📊 Status das User Stories

| US | Título | Status | Progresso |
|----|--------|--------|-----------|
| US-01 | Autenticação SSO | ✅ | 100% |
| US-02 | Controle de Status | ✅ | 100% |
| US-03 | Histórico de Status | ✅ | 100% |
| US-04 | Clientes e Ambientes | 🚧 | 60% |
| US-05 | Pipeline Integration | ✅ | 100% |
| US-06 | API de Versões | 🚧 | 40% |
| US-07 | Download de Pacotes | 🚧 | 20% |

## 🔗 API Endpoints

### Releases
- `POST /api/v1/releases/pipeline` - Criar release via pipeline
- `PUT /api/v1/releases/{id}/status` - Atualizar status
- `PUT /api/v1/releases/{id}/release-notes` - Atualizar release notes
- `PUT /api/v1/releases/{id}/prerequisites` - Atualizar pré-requisitos
- `GET /api/v1/releases/{id}` - Buscar release por ID
- `GET /api/v1/releases/{id}/history` - Histórico de mudanças

### Documentação Completa
- Swagger UI: http://localhost:8081/q/swagger-ui

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para questões e suporte:
- 📧 Email: suporte@empresa.com
- 📋 Issues: [GitHub Issues](https://github.com/empresa/release-manager/issues)
- 📖 Wiki: [Documentação Técnica](https://github.com/empresa/release-manager/wiki)