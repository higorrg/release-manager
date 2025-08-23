# Project Guidelines

## Prompt para geração completa:

Implemente um sistema chamado ReleaseManager, completo seguindo todas as especificações do arquivo AGENTS.md.

Foque nas User Stories detalhadas para entender os fluxos de negócio e dores dos usuários.

Use as tecnologias obrigatórias listadas e siga a arquitetura especificada.

Crie toda a estrutura: backend Quarkus com APIs REST, frontend Angular 18 responsivo, configuração Keycloak com Azure AD, integração Azure Blob Storage, migrações com Liquibase, containerização com Podman Compose, e exemplos de integração CI/CD na documentação.

O sistema deve resolver as dores de negócio descritas nas User Stories, não apenas implementar funcionalidades técnicas.

Documente tudo no arquivo README.md na raiz do projeto para servir de onboarding para desenvolvedores e analistas DevOps.

Compile tudo antes de terminar e certifique-se de que tudo funciona integrado desde o frontend até o banco de dados.

--- 

## Contexto do Negócio

O Release Manager é um sistema crítico para gerenciar o ciclo de vida de releases de software em uma empresa de desenvolvimento de software.

### Problemas Atuais

- **Falta de visibilidade**: Stakeholders interrompem constantemente o trabalho perguntando sobre status de releases
- **Processo manual**: Release Manager perde tempo atualizando status e enviando relatórios
- **Sem rastreabilidade**: Não há histórico de quem mudou o quê e quando
- **Integração inexistente**: Pipeline gera releases mas não notifica o sistema de gestão
- **Distribuição legada**: Pacotes são enviados por um sistema legado para clientes.

### Stakeholders

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

## Especificações Técnicas Obrigatórias

### Tecnologias Não-Negociáveis

- **Backend**: Java 21 + Quarkus 3.24.3.
- **Liquibase**: Disponível no Quarkus.
- **Frontend**: Angular 18+ com Standalone Components.
- **Autenticação**: Keycloak + Azure AD.
- **Storage**: Azure Blob Storage.
- **Database**: PostgreSQL 17.
- **Containerização**: Podman + Podman Compose (política de compliance - não Docker).

### Integrações

- **Azure Blob Storage**: Container "releases".
- **Keycloak**: Criar realm novo com importação automática. 
- **Pipeline CI/CD**: Viabilizar Gitlab CI e scrips groovy e bash.

### Autenticação

* A autenticação deverá ser realizada por Keycloak.
* Criar todos os artefatos necessários para configurar o Keycloak.
* A URL do AzureAD para o keycloak é: https://example.com

### Compliance e Segurança

- **Histórico Imutável**: Mudanças de status são append-only
- **Autenticação Obrigatória**: Todos endpoints protegidos
- **Logs Estruturados**: Para auditoria e monitoramento
- **Retenção de Dados**: Mínimo 5 anos para auditorias

### Ambiente de Desenvolvimento

- Apenas PostgreSQL + Keycloak em containers
- Backend e Frontend executam nativamente
- Hot reload habilitado

### Ambiente de Produção

- Stack completa em containers Podman
- Nginx para servir frontend
- Health checks e monitoramento
- Backup automático do banco

## Desenvolvimento do Backend

### Persona

Você é um desenvolvedor Java moderno, utilizando **Java 21** com **Quarkus** para construir aplicações reativas, eficientes e com boot ultrarrápido. Você aplica **arquitetura hexagonal** com forte coesão por feature e baixa 
acoplamento entre camadas. Você preza por legibilidade, testes fáceis, e responsabilidade única. Cada feature é isolada com seus próprios ports, use cases, domain model e adapters.

### Estrutura de Pacotes

Use **package-by-feature**, estruturando cada feature assim:

```
src/main/java/com/empresa/app/feature-x/
├── application/
│   ├── port/
│   │   ├── in/        --> Interfaces dos casos de uso (entrada)
│   │   └── out/       --> Interfaces dos gateways (saída)
│   └── service/       --> Implementações dos casos de uso
├── domain/
│   ├── model/         --> Entidades, Value Objects
│   └── event/         --> Eventos de domínio (opcional)
├── adapter/
│   ├── in/            --> REST, Messaging, etc. (entrada)
│   └── out/           --> Banco de dados, APIs externas (saída)
└── config/            --> Configuration específica da feature
```

### 🧱 Arquitetura Hexagonal

* Os **casos de uso** ficam em `application.service`
* As **interfaces (ports)** ficam em `application.port.in` (entrada) e `application.port.out` (saída)
* Os **adaptadores (adapters)** implementam os ports
* O **domínio** não conhece nada fora dele

### 📦 Modularização

* Evite `package com.empresa.app.service`, use `com.empresa.app.agendamento.application.service`
* Facilita coesão, testes, e localização de código
* Nunca use nested classes, sempre crie um arquivo para cada classe.
* Sempre utiliza princípios e práticas de Clean Code.
* Sempre utiliza SOLID:
  * [Single Responsibility Principle](https://stackify.com/solid-design-principles/): A class should have one, and only one, reason to change.
  * [Open/Closed Principle](https://stackify.com/solid-design-open-closed-principle/): Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification.
  * [Liskov Substitution Principle](https://stackify.com/solid-design-liskov-substitution-principle/): Objects of a superclass shall be replaceable with objects of its subclasses without breaking the application.
  * [Interface Segregation Principle](https://stackify.com/interface-segregation-principle/): Clients should not be forced to depend upon interfaces that they do not use.
  * [Dependency Inversion](https://stackify.com/dependency-inversion-principle/): High-level modules, which provide complex logic, should be easily reusable and unaffected by changes in low-level modules, which provide utility features.

### ✍️ Código

* Use **Java Records** para DTOs e Value Objects
* Use `Objects.isNull()` e `Objects.nonNull()` ao invés de `== null`
* Use `Optional` para retornos nulos, evite `null`
* Use `@Inject` do CDI ao invés de `@Autowired`
* Use `sealed`, `record`, `var` e outros recursos do Java 21

### 🧪 Testes

* Testes unitários para `application.service.*`
* Testes de integração para `adapter.*`
* Use `@QuarkusTest` para testar a integração completa
* Use `Testcontainers` para dependências como banco de dados

### Boas Práticas com Quarkus

* Use `@RestPath` e `@RestQuery` para endpoints REST.
* Prefira o `PanacheRepository` apenas em adapters.
* Use `@Transactional` apenas nos adapters (não em use cases).
* Use configuração via `application.properties`.
* Para agendamento, use `@Scheduled`.
* Sempre crie endpoints REST específicos, nunca reuse endpoints destinados a frontend, em integrações com outros sistemas.
* Versione as APIs por URL.

### Naming Conventions

| Camada        | Sufixo/Padrão                |
| ------------- | ---------------------------- |
| Port In       | `XxxUseCase`                 |
| Port Out      | `XxxRepository`, `XxxClient` |
| Use Case Impl | `XxxService`                 |
| Adapter In    | `XxxRestResource`            |
| Adapter Out   | `XxxRestClient`, `XxxJpa`    |
| Model         | `Xxx`, `XxxId`, `XxxEvent`   |

### Recursos Úteis

* [Quarkus Guides](https://quarkus.io/guides/)
* [Java 21 Features](https://openjdk.org/projects/jdk/21/)
* [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
* [Ports and Adapters com Quarkus](https://quarkus.io/blog/ports-and-adapters/)

---

## Desenvolvimento do Frontend

- You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.
- Use NG-Zorro component library based on Ant Design

### TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

### Angular Best Practices

- Always use standalone components over NgModules
- Do NOT set `standalone: true` inside the `@Component`, `@Directive` and `@Pipe` decorators
- Use signals for state management
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images.
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead

### State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

### Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
