# Release Manager - Especificações Simplificadas

## Sistema

Release Manager - Sistema para gerenciar o ciclo de vida completo de releases de software.

## Contexto de Negócio

- **Problema**: Gestão manual de releases causa interrupções constantes, falta de visibilidade e ausência de rastreabilidade
- **Solução**: Sistema automatizado com dashboard em tempo real e integração com pipeline CI/CD

## Stakeholders

- **Gestor de Release**: Pessoa responsável por coordenar todas as releases.
- **Dev Team**: Equipe de desenvolvimento que aprova MRs e gera versões.
- **QA Team**: Equipe de testes que valida releases em diferentes ambientes.
- **DevOps**: Equipe responsável por builds e deploy em produção.
- **Product Owners**: Gestores que precisam de visibilidade sobre cronogramas.
- **Clientes**: Empresas que usam o software em diferentes ambientes.

---

## User Stories Detalhadas

### US-01 - Autenticação Corporativa

**Contexto de Negócio:** A empresa já utiliza Azure AD para todos os sistemas internos. Devemos evitar que as equipes percam tempo gerenciando múltiplas credenciais e há riscos de segurança com senhas fracas ou reutilizadas.

**História:** Como **gestor de releases**,
eu quero **acessar o sistema usando minhas credenciais corporativas (Azure AD)**,
para **não precisar gerenciar outra senha e ter acesso baseado no meu perfil da empresa**.

**Regras de Negócio:**

- Apenas funcionários autorizados no Azure AD podem acessar
- Diferentes perfis de acesso (Admin, Read-only, etc.)
- Session timeout após inatividade
- Log de acessos para auditoria

**Cenários de Uso:**

- Funcionário tenta acessar → Redireciona para Azure AD → Login automático se já logado no Windows
- Funcionário sai da empresa → Acesso é revogado automaticamente no Azure AD
- Funcionário muda de departamento → Perfil de acesso é atualizado automaticamente

**Critérios de Aceitação:**

- A tela de login deve redirecionar o usuário para autenticação via AzureAD.
- Apenas usuários autorizados no AzureAD devem conseguir acessar o sistema.
- Após login bem-sucedido, o usuário deve ser redirecionado automaticamente à tela principal da aplicação.

---

### US-02 - Controle de Status das Releases

**Contexto de Negócio:** Uma release passa por 14 etapas diferentes, desde "MR Aprovado" até "Disponível". Cada etapa é responsabilidade de uma equipe diferente. Atualmente, o Release Manager atualiza uma planilha Excel e envia emails quando há mudanças.

**Fluxo de Trabalho Real:**

1. **Dev Team**: Aprova MR → Status: "MR Aprovado"
2. **DevOps**: Executa build → Status: "Falha no Build" ou "Para Teste de Sistema"
3. **QA**: Testa em homologação → Status: "Reprovada/Aprovada no teste"
4. **DevOps**: Build produção → Status: "Falha no Build para Produção" ou "Para Teste Regressivo"
5. **QA**: Teste regressivo → Status: "Reprovada/Aprovada no teste regressivo"
6. **Release Manager**: Controla distribuição → Status: "Controlada", "Interna", "Disponível"

**História:** Como **gestor de releases**,
eu quero **atualizar e visualizar o status atual de cada release em tempo real**,
para **que todas as equipes saibam exatamente em que etapa cada versão está, sem precisar me perguntar**.

**Dores Atuais:**

- 15+ interrupções por dia perguntando "qual o status da versão X?"
- Esquecimento de atualizar planilha causa confusão
- Equipes trabalham com informações desatualizadas
- Sem visibilidade de gargalos no processo

**Valor Esperado:**

- Dashboard em tempo real para todas as equipes
- Redução drástica de interrupções
- Identificação proativa de gargalos
- Comunicação automática de mudanças críticas

**Critérios de Aceitação:**

- Ao acessar uma release, o status pode ser alterado e uma observação pode ser informada opcionalmente.
- Ao acessar uma release, o status atual deve ser apresentado.
- Os status disponíveis são:
  - MR Aprovado
  - Falha no Build para Teste
  - Para Teste de Sistema
  - Em Teste de Sistema
  - Reprovada no teste
  - Aprovada no teste
  - Falha no Build para Produção
  - Para Teste Regressivo
  - Em Teste Regressivo
  - Falha na instalação da Estável
  - Interno
  - Revogada
  - Reprovada no teste regressivo
  - Aprovada no teste regressivo
  - Controlada
  - Disponível

---

### US-03 - Histórico Imutável de Mudanças

**Contexto de Negócio:** A empresa passa por auditorias regulares e precisa comprovar quando e por quem cada decisão foi tomada.

**História:** Como **gestor de releases**,
eu quero **consultar o histórico completo de mudanças de status de qualquer release**,
para **entender a timeline, identificar problemas recorrentes e comprovar conformidade com processos**.

**Regras de Negócio:**

- Histórico é imutável (não pode ser editado ou excluído).
- Cada mudança registra: usuário, timestamp, status anterior, novo status e uma observação opcional.
- Retenção mínima de 5 anos para auditorias.
- Acesso controlado por perfil de usuário.

**Cenários de Uso:**

- Auditoria pergunta: "Quem aprovou a release 8.5.0 para produção?" → Sistema mostra histórico completo.
- Gestor quer saber: "Por que a versão 8.4.3 demorou 2 semanas em teste?" → Histórico mostra 3 reprovas consecutivas.
- Processo de melhoria: "Onde estão nossos gargalos?" → Relatório mostra que 60% das releases falham no primeiro build.

**Critérios de Aceitação:**

- Deve ser criada uma tabela ou mecanismo de armazenamento.
- Um novo registro deve ser incluído sempre que ocorrer uma alteração de status da release.
- Não devem existir operações de alteração ou exclusão dos registros, apenas inserções.

---

### US-04 - Relacionamento Release-Cliente-Ambiente

**Contexto de Negócio:** O software da empresa é vendido para diferentes clientes. Cada cliente pode ter ambiente de homologação e produção. Nem todas as releases são adequadas para todos os clientes ou ambientes.

**Exemplo Real:**

- Release 8.5.0: Liberada para Cliente A (produção) e Cliente B (homologação).
- Release 8.4.9: Patch crítico liberado para todos os clientes em produção.
- Release 9.0.0: Beta apenas para clientes parceiros em homologação.

**História:** Como **gestor de releases**,
eu quero **definir quais clientes podem usar cada release e em quais ambientes**,
para **controlar a distribuição e garantir que clientes recebam apenas versões adequadas ao seu contexto**.

**Regras de Negócio:**

- Cliente pode ter código interno diferente do nome comercial.
- Mesmo cliente pode ter comportamentos diferentes entre homologação e produção.
- Releases podem ser restritivas (apenas clientes específicos) ou abertas (todos os clientes).
- Histórico de quais clientes usaram quais versões.

**Cenários de Uso:**

- Cliente Premium quer testar nova feature → Release Manager libera versão beta só para ele em homologação
- Bug crítico descoberto → Release Manager bloqueia versão para novos clientes mas mantém para quem já usa
- Release estável → Release Manager libera para todos os clientes em produção

**Critérios de Aceitação:**

- Deve ser possível informar manualmente o código de um ou mais clientes para uma release.
- Deve ser possível associar a cada código de cliente o ambiente correspondente (homologação ou produção).
- O sistema deve emitir uma mensagem de alerta se o usuário informar código de cliente e ambiente duplicados.
- Deve ser possível excluir um item desta lista.
- A relação entre release, código de cliente e ambiente deve estar disponível para consulta pela API.

---

### US-05 - Integração Automática com Pipeline

**Contexto de Negócio:** A empresa tem pipeline CI/CD que gera automaticamente versões quando MRs são aprovados. Atualmente, o Release Manager só fica sabendo por email ou Slack, causando atraso na comunicação para stakeholders.

**Fluxo Atual vs Desejado:**

- **Atual**: Pipeline gera versão → Desenvolvedor envia mensagem → Release Manager vê a mensagem → Atualiza planilha → Avisa stakeholders.
- **Desejado**: Pipeline gera versão → Chama API → Sistema atualiza automaticamente → Stakeholders veem em tempo real.

**História:** Como **gestor de releases**,

eu quero **que a pipeline envie automaticamente os dados da release para a API do sistema Release Manager assim que o MR da versão for aprovado pelo engenheiro de software principal**,

para **que a nova release seja registrada com o status inicial de “MR Aprovado”, garantindo rastreabilidade e padronização no processo de versionamento**.

**Regras de Negócio:**

- Apenas versões que passaram na aprovação do MR devem ser registradas.
- Sistema deve distinguir entre Kit (major), Service Pack (minor) e Patch.
- Não deve haver duplicação para a mesma versão.
- Status inicial sempre "MR Aprovado".
- Deve incluir metadados: produto, versão, branch, commit hash.

**Cenários de Uso:**

- Pipeline cria versão 8.5.0 → API registra automaticamente → Equipes veem nova versão no dashboard.
- Pipeline tenta registrar 8.5.0 novamente → Sistema atualiza sem duplicar.
- Pipeline falha antes do MR → Nenhum registro é criado → Não há "falsos positivos".

**Critérios de Aceitação:**

- A API do Release Manager deve ser acionada automaticamente pela pipeline após a aprovação do MR na branch de versão (Kit, SP ou Patch).
- A API do Release Manager deve ser orientada a versão, não ao ID da release.
- A requisição deve conter:
  - Nome do produto
  - Versão (major, minor ou patch)
- A release deve ser registrada na API com o status inicial **MR Aprovado**.
- A chamada da API deve ocorrer na etapa de geração de versões da pipeline.

---

### US-06 - API de Versões Disponíveis para Clientes

**Contexto de Negócio:** Clientes consultam constantemente quais versões podem atualizar. Atualmente isso é feito via email/telefone, gerando trabalho manual e atrasos. Clientes querem integrar essa consulta em seus próprios sistemas de atualização.

**História:** Como **Sistema do Cliente**,
eu quero **consultar via API quais versões estão disponíveis para meu ambiente específico**,
para **que possa realizar o download da nova versão**.

**Regras de Negócio:**

- API deve filtrar por código do cliente e ambiente (homologação/produção).
- Retornar apenas versões "Disponíveis" ou "Controladas" aprovadas para aquele cliente.
- Incluir release notes, pré-requisitos e URL de download.
- Versionamento da API para compatibilidade.

**Cenários de Uso:**

- Sistema do cliente ABC consulta versões para produção → Recebe lista filtrada com apenas versões aprovadas.
- Sistema de parceiro consulta versões beta → Recebe versões experimentais liberadas especialmente.
- Cliente tenta acessar versão não liberada → API retorna lista vazia/negação.

**Critérios de Aceitação:**

- A listagem deve apresentar as versões disponíveis para atualização para cada cliente, separadas por ambiente (homologação e produção).
- A resposta da API deve conter, para cada versão: número da versão, release notes, pré-requisitos e a URL de download.
- Release notes e pré-requisitos serão cadastrados manualmente.

---

### US-07 - Distribuição de Pacotes

**Contexto de Negócio:** Pacotes de instalação (.zip, .tar.gz) precisam ser baixados pelos sistemas instalados nos clientes de forma transparente.

**Problemas Atuais:**

- Links ocupam banda dos nossos servidores.
- Sem controle de acesso (qualquer um com link baixa).
- Sem métricas de download.
- Processo legado de upload/compartilhamento.

**História:** Como **Cliente**,
eu quero **baixar pacotes de instalação diretamente através de URLs persistentes e seguras**,
para **atualizar meu ambiente**.

**Regras de Negócio:**

- Pacotes armazenados em cloud storage seguro.
- URLs públicas mas não-listáveis (segurança por obscuridade).
- Controle de acesso baseado na liberação da release para o cliente.
- Métricas de download para insights de adoção.

**Cenários de Uso:**

- Cliente acessa sistema → Vê lista de versões → Clica download → Baixa diretamente do storage.
- Pipeline gera novo pacote → Upload automático → URL disponível imediatamente.
- Release é revogada → Sistema deixa de apresentar a release na listagem para os clientes automaticamente.

**Critérios de Aceitação:**

- O sistema deve disponibilizar o pacote da versão (ex: `.zip`, `.tar.gz`) para download.
- O pacote deve conter o produto completo e seus componentes.
- Os pacotes deverão ser armazenados no blob storage da Azure.

---

## Stack Tecnológica

### Backend

- **Java 21 + Quarkus 3.24.3**
- **PostgreSQL 17** com Liquibase
- **Arquitetura hexagonal** (package-by-feature)
- **Azure Blob Storage** para armazenamento de pacotes

### Frontend

- **Angular 18+** com Standalone Components
- **NG-Zorro** (Ant Design)
- **Signals** para gerenciamento de estado
- **OnPush** change detection

### Infraestrutura

- **Keycloak** para autenticação
- **Podman + Podman Compose** (sem Docker)
- **Nginx** para servir frontend em produção

## Arquitetura Backend (Quarkus)

**A arquitetura do backend é Hexagonal.**

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
├── client/                   → Similar structure
└── integration/              → Pipeline integration
```

### Naming Conventions

- **Ports In**: `XxxUseCase`
- **Ports Out**: `XxxRepository`, `XxxClient`
- **Services**: `XxxService`
- **REST**: `XxxRestResource`
- **JPA**: `XxxJpaRepository`

## Arquitetura Frontend (Angular)

```
src/app/
├── features/
│   ├── releases/
│   ├── clients/
│   └── dashboard/
├── shared/
│   ├── components/
│   ├── services/
│   └── models/
└── core/
    ├── auth/
    └── api/
```

## Padrões de Código

### Java/Quarkus

- Java Records para DTOs
- `Optional` ao invés de null
- `@Inject` (CDI) ao invés de `@Autowired`
- `@RestPath`/`@RestQuery` para REST
- `@Transactional` apenas em adapters

### Angular/TypeScript

- Standalone components (sem NgModules)
- `input()`/`output()` functions
- `computed()` para estado derivado
- Control flow nativo (`@if`, `@for`, `@switch`)
- `inject()` ao invés de constructor injection

## Ambientes

### Desenvolvimento

- PostgreSQL + Keycloak em containers
- Backend/Frontend executam nativamente
- Hot reload habilitado

### Produção

- Stack completa containerizada
- Health checks e monitoramento
- Backup automático

## Integrações

- **Azure AD**: [https://example.com](https://example.com)
- **Pipeline CI/CD**: GitLab CI com scripts Groovy/Bash
- **Azure Blob Storage**: Container "releases"

## Compliance

- Logs estruturados para auditoria
- Histórico imutável de mudanças
- Todos endpoints protegidos por autenticação
- Retenção de dados por 5+ anos
