# Release Manager

Sistema crítico para gerenciar o ciclo de vida de releases de software, resolvendo problemas de visibilidade, processo manual e falta de rastreabilidade no processo de releases.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Problemas Resolvidos](#problemas-resolvidos)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [APIs](#apis)
- [CI/CD](#cicd)
- [Contribuição](#contribuição)
- [Suporte](#suporte)

## 🎯 Visão Geral

O Release Manager é um sistema desenvolvido para resolver dores críticas no processo de releases de uma empresa de desenvolvimento de software:

- **Falta de visibilidade**: Stakeholders interrompem constantemente o trabalho perguntando sobre status
- **Processo manual**: Release Manager perde tempo atualizando status e enviando relatórios
- **Sem rastreabilidade**: Não há histórico de quem mudou o quê e quando
- **Integração inexistente**: Pipeline gera releases mas não notifica o sistema
- **Distribuição legada**: Pacotes são enviados por sistema legado

## 🔧 Problemas Resolvidos

### Stakeholders e Dores

| Stakeholder | Dor Atual | Solução |
|-------------|-----------|---------|
| **Gestor de Release** | 15+ interrupções por dia sobre status | Dashboard em tempo real |
| **Dev Team** | Não sabem quando MR vira release | Integração automática com pipeline |
| **QA Team** | Perdem tempo verificando o que testar | Notificações automáticas por status |
| **DevOps** | Não sabem quais versões liberar | API de versões autorizadas |
| **Product Owners** | Sem visibilidade de cronogramas | Relatórios e métricas automáticas |
| **Clientes** | Processo manual para verificar atualizações | API pública para consulta |

## ✨ Funcionalidades

### US-01: Autenticação Corporativa
- Login via Azure AD integrado ao Keycloak
- SSO automático se já logado no Windows
- Perfis de acesso baseados em grupos AD
- Revogação automática quando funcionário sai da empresa

### US-02: Controle de Status das Releases
- 14 status diferentes do fluxo real da empresa
- Dashboard em tempo real para todas as equipes
- Observações opcionais em cada mudança de status
- Redução drástica de interrupções

### US-03: Histórico Imutável de Mudanças
- Registro append-only de todas as mudanças
- Auditoria completa: usuário, timestamp, status anterior/novo
- Retenção mínima de 5 anos
- Relatórios para identificar gargalos no processo

### US-04: Relacionamento Release-Cliente-Ambiente
- Controle granular de quais clientes podem usar cada release
- Separação por ambiente (homologação/produção)
- Histórico de distribuição por cliente
- Bloqueio/liberação seletiva de versões

### US-05: Integração Automática com Pipeline
- API para pipelines notificarem releases automaticamente
- Registro automático quando MR é aprovado
- Orientada a versão, não ID
- Evita duplicação e falsos positivos

### US-06: API de Versões Disponíveis para Clientes
- Consulta via API filtrada por cliente e ambiente
- Inclui release notes, pré-requisitos e URL de download
- Integração com sistemas de atualização dos clientes
- Versionamento da API para compatibilidade

### US-07: Distribuição de Pacotes
- Armazenamento seguro no Azure Blob Storage
- URLs persistentes e seguras para download
- Controle de acesso baseado na liberação
- Métricas de download para insights de adoção

## 🏗️ Arquitetura

### Visão Geral
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │   Database      │
│   Angular 18    │◄──►│   Quarkus 3.24   │◄──►│  PostgreSQL 17  │
│   Material UI   │    │   Java 21        │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌──────────────────┐             │
         └─────────────►│    Keycloak      │             │
                        │   + Azure AD     │             │
                        └──────────────────┘             │
                                 │                       │
                        ┌──────────────────┐             │
                        │  Azure Blob      │             │
                        │    Storage       │             │
                        └──────────────────┘             │
                                                         │
                        ┌──────────────────┐             │
                        │   CI/CD Pipeline │─────────────┘
                        │ (GitLab/Jenkins) │
                        └──────────────────┘
```

### Arquitetura Hexagonal (Backend)
```
src/main/java/com/releasemanager/
├── releases/
│   ├── application/
│   │   ├── port/in/          # Use Cases (entrada)
│   │   ├── port/out/         # Repositories (saída)
│   │   └── service/          # Implementações
│   ├── domain/
│   │   └── model/            # Entidades, Value Objects
│   └── adapter/
│       ├── in/               # REST Controllers
│       └── out/              # JPA Repositories
├── clients/                  # Feature de clientes
├── audit/                    # Feature de auditoria
└── storage/                  # Feature de armazenamento
```

## 🛠️ Tecnologias

### Backend
- **Java 21** - LTS com recursos modernos
- **Quarkus 3.24.3** - Framework reativo e cloud-native
- **PostgreSQL 17** - Banco de dados principal
- **Liquibase** - Migrations de banco
- **Keycloak** - Autenticação e autorização
- **Azure Blob Storage** - Armazenamento de pacotes

### Frontend
- **Angular 18** - Framework com Standalone Components
- **Angular Material** - Componentes UI responsivos
- **TypeScript** - Tipagem estática
- **RxJS** - Programação reativa
- **Keycloak-js** - Integração de autenticação

### DevOps
- **Podman + Podman Compose** - Containerização
- **Nginx** - Proxy reverso e servir frontend
- **GitLab CI / Jenkins / GitHub Actions** - Pipelines CI/CD

## 📋 Pré-requisitos

### Desenvolvimento
- Java 21 JDK
- Node.js 18+
- npm 9+
- Podman e Podman Compose

### Produção
- Podman/Docker
- PostgreSQL 17
- Azure Storage Account
- Azure AD configurado
- Keycloak

## 🚀 Instalação

### 1. Desenvolvimento Local

```bash
# Clone o repositório
git clone <repository-url>
cd release-manager

# Inicie os serviços de infraestrutura
podman-compose -f docker-compose.dev.yml up -d

# Aguarde a inicialização (o setup é automático)
# Verifique os logs: podman-compose -f docker-compose.dev.yml logs setup

# Inicie o backend
cd backend
./mvnw quarkus:dev

# Em outro terminal, inicie o frontend
cd frontend
npm install
npm start
```

### 2. Produção

```bash
# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seus valores

# Inicie os serviços
podman-compose -f docker-compose.prod.yml up -d
```

### Verificação da Instalação

Após a instalação, verifique se os serviços estão funcionando:

```bash
# Health checks
curl http://localhost:8081/health        # Backend
curl http://localhost:4200/health        # Frontend (dev)
curl http://localhost:8080/health/ready  # Keycloak
```

## ⚙️ Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
# Database
DATABASE_PASSWORD=sua_senha_segura
DATABASE_USER=release_manager
DATABASE_NAME=release_manager

# Keycloak
KEYCLOAK_ADMIN_PASSWORD=senha_admin_segura
KEYCLOAK_CLIENT_SECRET=secret_cliente_seguro
KEYCLOAK_HOSTNAME=seu-dominio.com

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=sua_connection_string

# URLs
FRONTEND_URL=https://seu-dominio.com
BACKEND_URL=https://seu-dominio.com:8081
```

### Azure AD Configuration

1. Registre uma aplicação no Azure AD
2. Configure redirecionamento para Keycloak
3. Anote: `CLIENT_ID`, `CLIENT_SECRET`, `TENANT_ID`
4. Atualize o arquivo `keycloak/realm-config/release-manager-realm.json`

### Azure Storage

1. Crie uma Storage Account
2. Crie um container chamado `releases`
3. Obtenha a connection string
4. Configure a variável `AZURE_STORAGE_CONNECTION_STRING`

## 📖 Uso

### Acesso ao Sistema

1. **Frontend**: http://localhost:4200 (dev) / https://seu-dominio.com (prod)
2. **Keycloak Admin**: http://localhost:8080/admin
3. **Backend APIs**: http://localhost:8081/api

### Usuários de Desenvolvimento

O sistema cria automaticamente usuários para desenvolvimento:

| Usuário | Senha | Perfil | Descrição |
|---------|-------|--------|-----------|
| `admin` | `admin123` | Administrador | Acesso completo |
| `release.manager` | `manager123` | Gestor de Release | Gerencia releases |
| `viewer` | `viewer123` | Visualizador | Apenas leitura |

### Fluxo de Trabalho

1. **Pipeline registra release**:
   ```bash
   curl -X POST http://localhost:8081/api/pipeline/v1/releases \
     -H "Content-Type: application/json" \
     -d '{"productName": "Sistema Principal", "version": "1.0.0"}'
   ```

2. **Gestor atualiza status**: Via interface web ou API

3. **Clientes consultam versões**:
   ```bash
   curl http://localhost:8081/api/public/v1/clients/CLI001/releases?environment=producao
   ```

## 🔌 APIs

### API de Pipeline (Integração CI/CD)

```http
POST /api/pipeline/v1/releases
Content-Type: application/json

{
  "productName": "Sistema Principal",
  "version": "1.0.0"
}
```

### API Pública (Clientes)

```http
GET /api/public/v1/clients/{clientCode}/releases?environment=producao
```

Resposta:
```json
[
  {
    "version": "1.0.0",
    "releaseNotes": "Correções e melhorias",
    "prerequisites": "Java 21+",
    "downloadUrl": "https://storage.blob.core.windows.net/releases/1.0.0/package.zip"
  }
]
```

### API Administrativa

- `GET /api/v1/releases` - Listar releases
- `PUT /api/v1/releases/{id}/status` - Atualizar status
- `GET /api/v1/audit/releases/{id}/history` - Histórico
- `POST /api/v1/clients` - Cadastrar cliente

## 🔄 CI/CD

### Integração com Pipeline

O sistema fornece exemplos para:

- **GitLab CI**: `ci-cd/gitlab/.gitlab-ci.yml`
- **Jenkins**: `ci-cd/jenkins/Jenkinsfile`  
- **GitHub Actions**: `ci-cd/github-actions/deploy.yml`
- **Script universal**: `ci-cd/scripts/release-notification.sh`

### Exemplo de Uso no Pipeline

```bash
# GitLab CI
PRODUCT_NAME="Sistema Principal" VERSION="$CI_COMMIT_TAG" \
  ./ci-cd/scripts/release-notification.sh

# Jenkins
PRODUCT_NAME="Sistema Principal" VERSION="$TAG_NAME" \
  ./ci-cd/scripts/release-notification.sh

# GitHub Actions
PRODUCT_NAME="Sistema Principal" VERSION="${{ github.ref_name }}" \
  ./ci-cd/scripts/release-notification.sh
```

## 🔐 Segurança

### Medidas Implementadas

- ✅ Autenticação obrigatória via Keycloak + Azure AD
- ✅ Autorização baseada em perfis (RBAC)
- ✅ Histórico imutável para auditoria
- ✅ Logs estruturados para monitoramento
- ✅ HTTPS em produção
- ✅ Headers de segurança no frontend
- ✅ Controle de acesso granular a releases

### Compliance

- **Retenção**: Mínimo 5 anos para auditorias
- **Auditoria**: Histórico completo de mudanças
- **Segregação**: Perfis baseados em responsabilidades
- **Monitoramento**: Logs de todas as operações

## 📊 Monitoramento

### Health Checks

```bash
# Verificar saúde dos serviços
curl http://localhost:8081/health
curl http://localhost:8080/health/ready
```

### Métricas

- **Prometheus**: `/metrics` endpoint disponível
- **Logs**: JSON estruturado para análise
- **Auditoria**: Todas as mudanças são logadas

## 🤝 Contribuição

### Desenvolvimento

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Faça suas alterações
4. Teste localmente
5. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
6. Push: `git push origin feature/nova-funcionalidade`
7. Abra um Pull Request

### Convenções

- **Commits**: Use Conventional Commits
- **Backend**: Siga as práticas de Clean Architecture
- **Frontend**: Use Angular best practices
- **Testes**: Mantenha cobertura > 80%

## 🆘 Suporte

### Problemas Comuns

1. **Erro de conexão com banco**:
   ```bash
   # Verifique se o PostgreSQL está rodando
   podman-compose logs postgres
   ```

2. **Keycloak não inicia**:
   ```bash
   # Aguarde o banco estar pronto
   podman-compose logs keycloak
   ```

3. **Frontend não carrega**:
   ```bash
   # Verifique as variáveis de ambiente
   cat frontend/src/environments/environment.ts
   ```

### Logs

```bash
# Backend
cd backend && ./mvnw quarkus:dev

# Containers
podman-compose logs -f [service-name]
```

### Contato

- **Issues**: Use o GitHub Issues para reportar problemas
- **Documentação**: Este README e código comentado
- **Suporte**: Equipe de DevOps da empresa

## 📄 Licença

Este projeto é propriedade da empresa e está sob licença corporativa.

---

**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024  
**Compatibilidade**: Java 21, Angular 18, PostgreSQL 17