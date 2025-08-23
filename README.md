# Release Manager

Sistema completo para gerenciar o ciclo de vida de releases de software, desenvolvido com arquitetura moderna e tecnologias enterprise.

## 📋 Visão Geral

O Release Manager é uma solução completa que automatiza e centraliza o gerenciamento de releases, eliminando processos manuais e oferecendo visibilidade em tempo real para todas as equipes envolvidas no processo de desenvolvimento e deploy.

### Principais Funcionalidades

- **Dashboard em Tempo Real** - Visibilidade completa do status de todas as releases
- **Gestão de Status** - Controle detalhado de 15 status diferentes do ciclo de vida
- **Histórico Imutável** - Rastreabilidade completa de mudanças para auditorias
- **Gestão de Clientes** - Controle granular de quais releases são disponibilizadas para cada cliente
- **Integração com Pipeline** - Registro automático de releases via API
- **Distribuição de Pacotes** - Armazenamento seguro em Azure Blob Storage
- **Autenticação Corporativa** - Integração com Azure AD via Keycloak

## 🏗️ Arquitetura

### Stack Tecnológica

**Backend:**
- Java 21 + Quarkus 3.16.4
- PostgreSQL 17 com Liquibase
- Arquitetura Hexagonal (Package-by-Feature)
- Azure Blob Storage para pacotes

**Frontend:**
- Angular 18+ com Standalone Components
- NG-Zorro (Ant Design)
- Signals para gerenciamento de estado
- OnPush change detection

**Infraestrutura:**
- Keycloak 25.0 para autenticação
- Podman + Podman Compose
- Nginx para proxy reverso

### Arquitetura Backend (Hexagonal)

```
src/main/java/com/empresa/releasemanager/
├── release/
│   ├── application/
│   │   ├── port/in/          → ReleaseUseCase
│   │   ├── port/out/         → ReleaseRepository  
│   │   └── service/          → ReleaseService
│   ├── domain/model/         → Release, ReleaseStatus
│   └── adapter/
│       ├── in/               → ReleaseRestResource
│       └── out/              → ReleaseJpaRepository
├── client/                   → Estrutura similar
└── integration/              → Azure, Pipeline
```

### Arquitetura Frontend

```
src/app/
├── features/
│   ├── releases/     → Gestão de releases
│   ├── clients/      → Gestão de clientes  
│   └── dashboard/    → Dashboard principal
├── shared/
│   ├── components/   → Componentes reutilizáveis
│   ├── services/     → Serviços da aplicação
│   └── models/       → Modelos TypeScript
└── core/
    ├── auth/         → Autenticação
    └── api/          → Cliente HTTP
```

## 🚀 Quick Start

### Pré-requisitos

- **Podman** 4.0+
- **Podman Compose** 1.0+
- **Java 21** (para desenvolvimento backend)
- **Node.js 20+** (para desenvolvimento frontend)
- **Maven 3.8+** (para build backend)

### Instalação Rápida

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd release-manager
   ```

2. **Inicie o ambiente de desenvolvimento**
   ```bash
   ./scripts/setup-dev.sh
   ```

3. **Acesse as aplicações**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8080
   - Keycloak Admin: http://localhost:8180

## 🛠️ Desenvolvimento

### Configuração do Ambiente de Desenvolvimento

1. **Inicie a infraestrutura**
   ```bash
   ./scripts/setup-dev.sh
   ```

2. **Backend (Terminal 1)**
   ```bash
   cd backend
   mvn quarkus:dev
   ```

3. **Frontend (Terminal 2)**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Estrutura de Dados

O sistema gerencia releases com 15 status diferentes:

- **MR Aprovado** → **Falha no Build para Teste** → **Para Teste de Sistema**
- **Em Teste de Sistema** → **Reprovada/Aprovada no teste**
- **Falha no Build para Produção** → **Para Teste Regressivo**
- **Em Teste Regressivo** → **Reprovada/Aprovada no teste regressivo**
- **Falha na instalação da Estável** → **Interno** → **Controlada** → **Disponível**
- **Revogada** (pode vir de qualquer status)

### Usuários de Teste

| Usuário | Senha | Perfil |
|---------|-------|--------|
| admin | admin123 | Administrador |
| release.manager | manager123 | Gestor de Releases |
| qa.analyst | qa123 | Analista QA |
| developer | dev123 | Desenvolvedor |
| pipeline | pipeline123 | Sistema/Pipeline |

## 📡 APIs

### Endpoints Principais

**Releases:**
- `GET /api/releases` - Listar todas releases
- `POST /api/releases` - Criar nova release (Pipeline)
- `PUT /api/releases/{id}/status` - Atualizar status
- `GET /api/releases/client/{code}/environment/{env}` - Releases disponíveis para cliente

**Clientes:**
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `PUT /api/clients/{code}` - Atualizar cliente

**Packages:**
- `POST /api/packages/upload/{product}/{version}` - Upload de pacote
- `GET /api/packages/download/{product}/{version}` - URL de download

### Documentação da API

Acesse a documentação Swagger em: http://localhost:8080/q/swagger-ui/

### Exemplo de Integração com Pipeline

```bash
# Criar nova release via API
curl -X POST http://localhost:8080/api/releases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productName": "Sistema Principal",
    "version": "1.0.0",
    "versionType": "KIT",
    "branchName": "release/1.0.0",
    "commitHash": "abc123456"
  }'
```

## 🔧 Configuração

### Variáveis de Ambiente

**Backend (.env ou application.yml):**
```yaml
# Database
DB_HOST: localhost
DB_PORT: 5432
DB_USER: releasemanager
DB_PASSWORD: releasemanager123

# Keycloak
KEYCLOAK_URL: http://localhost:8180
KEYCLOAK_REALM: releasemanager
KEYCLOAK_CLIENT_SECRET: secret

# Azure Storage
AZURE_STORAGE_ACCOUNT_NAME: your-account
AZURE_STORAGE_ACCOUNT_KEY: your-key
AZURE_STORAGE_CONTAINER: releases
```

**Frontend (environment.ts):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  keycloak: {
    url: 'http://localhost:8180',
    realm: 'releasemanager',
    clientId: 'release-manager-frontend'
  }
};
```

## 🏭 Produção

### Deploy em Produção

1. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.prod
   # Edite .env.prod com suas configurações
   ```

2. **Inicie o ambiente de produção**
   ```bash
   ./scripts/setup-prod.sh
   ```

### Configurações de Segurança

- **Senhas:** Altere todas as senhas padrão
- **SSL/TLS:** Configure certificados apropriados
- **Firewall:** Configure regras de rede adequadas
- **Backup:** Implemente rotina de backup do PostgreSQL

### Integração com Azure AD

1. **Configure no arquivo realm-config.json:**
   ```json
   {
     "identityProviders": [{
       "alias": "azure-ad",
       "config": {
         "clientId": "your-azure-client-id",
         "clientSecret": "your-azure-client-secret",
         "authorizationUrl": "https://login.microsoftonline.com/tenant-id/oauth2/v2.0/authorize"
       }
     }]
   }
   ```

2. **Configure no Azure AD:**
   - Registre a aplicação
   - Configure URLs de redirecionamento
   - Defina escopos necessários

## 📊 Monitoramento

### Health Checks

- **Backend:** http://localhost:8080/health
- **Frontend:** http://localhost:80/health
- **Database:** Incluído no Docker Compose

### Métricas

- **Prometheus:** http://localhost:8080/q/metrics
- **Logs estruturados:** JSON format com correlationId

### Scripts de Manutenção

```bash
# Visualizar logs
./scripts/logs.sh --prod backend -f

# Backup do banco
./scripts/backup-db.sh

# Parar ambiente
./scripts/stop-prod.sh
```

## 🧪 Testes

### Backend

```bash
cd backend
mvn test                    # Unit tests
mvn integration-test        # Integration tests
mvn verify                  # All tests + quality checks
```

### Frontend

```bash
cd frontend
npm test                    # Unit tests
npm run e2e                 # E2E tests (se configurado)
npm run lint                # Linting
```

## 🔧 Troubleshooting

### Problemas Comuns

**Backend não conecta no banco:**
- Verifique se PostgreSQL está rodando: `podman ps`
- Verifique logs: `./scripts/logs.sh postgres`

**Frontend não carrega:**
- Verifique se o proxy está configurado corretamente
- Verifique CORS no backend

**Keycloak não autentica:**
- Verifique se o realm foi importado corretamente
- Verifique URLs de redirecionamento

### Logs e Debugging

```bash
# Logs de todos os serviços
./scripts/logs.sh

# Logs específicos com follow
./scripts/logs.sh --prod backend -f

# Logs com mais linhas
./scripts/logs.sh -t 100 backend
```

## 📚 Documentação Adicional

### Para Desenvolvedores

- **Padrões de Código:** Seguir convenções Quarkus e Angular
- **Testes:** Cobertura mínima de 80%
- **Commits:** Seguir Conventional Commits
- **Arquitetura:** Manter separação clara entre camadas

### Para DevOps

- **CI/CD:** Integrar com GitLab CI ou GitHub Actions
- **Monitoring:** Configurar Prometheus + Grafana
- **Backup:** Automatizar backups diários do PostgreSQL
- **Security:** Realizar scans de vulnerabilidade regularmente

### Para Analistas

- **Business Rules:** Documentadas nas User Stories (AGENTS.md)
- **Fluxos:** Disponíveis no dashboard em tempo real
- **Relatórios:** Exportáveis via API ou interface

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Para suporte técnico ou dúvidas:

1. **Issues:** Abra uma issue no GitHub
2. **Email:** suporte@empresa.com  
3. **Documentação:** Consulte este README e a documentação da API

---

**Release Manager** - Automatizando o futuro das releases de software 🚀