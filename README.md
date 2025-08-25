# Release Manager

Sistema para gerenciar o ciclo de vida de releases de software.

## Arquitetura

- **Backend**: Java 21 + Quarkus 3.24.3
- **Frontend**: Angular 18 + NG-Zorro (Ant Design)
- **Database**: PostgreSQL 17
- **Containerização**: Podman + Podman Compose

## Estrutura do Projeto

```
release-manager/
├── backend/           # Backend Quarkus com Java 21
├── frontend/          # Frontend Angular 18
├── docker/            # Configurações de containerização
├── docs/              # Documentação do projeto
├── ci-cd/             # Exemplos de integração CI/CD
│   ├── gitlab/        # Scripts para GitLab CI
│   └── examples/      # Exemplos de integração
└── README.md
```

## Desenvolvimento

### Pré-requisitos

- Java 21
- Node.js 18+
- Podman / Docker
- PostgreSQL 17

### Backend

```bash
cd backend
./mvnw quarkus:dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Database (Desenvolvimento)

```bash
cd docker
podman-compose up postgres
```

## Produção

```bash
cd docker
podman-compose up -d
```

## Funcionalidades

- Controle de status de releases
- Histórico imutável de mudanças
- Gestão de clientes e ambientes
- API para integração com pipelines
- Distribuição de pacotes
- Sistema de autenticação