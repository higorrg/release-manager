# Project Guidelines

## User Stories

### US-01 - Segurança

**Título da História:** Segurança (Autenticação e Autorização)

**História:**

Como **Release Manager**,

eu quero **autenticar-me na aplicação utilizando login via SSO integrado ao AzureAD através do Keycloak**,

para **acessar o sistema com segurança e praticidade, aproveitando as credenciais corporativas já existentes**.

**Critérios de Aceitação:**

- A tela de login deve redirecionar o usuário para autenticação via AzureAD.
- Apenas usuários autorizados no AzureAD devem conseguir acessar o sistema.
- Após login bem-sucedido, o usuário deve ser redirecionado automaticamente à tela principal da aplicação.

### US-02 - Controlar status de cada etapa da release

**Título da História:** Alterar status das etapas da release

**História:**

Como **Release Manager**,

eu quero **alterar o status de cada etapa da release**,

para **que os stakeholders possam ter visibilidade do status da release**.

**Critérios de Aceitação:**

- Ao acessar uma release, o status pode ser alterado.
- Ao acessar uma release, o status atual deve ser apresentado.
- Os status disponíveis para seleção devem incluir:
    - MR Aprovado
    - Falha no Build para Teste
    - Para Teste de Sistema
    - Reprovada no teste
    - Aprovada no teste
    - Falha no Build para Produção
    - Para Teste Regressivo
    - Falha na instalação da Estável
    - Interno
    - Revogada
    - Reprovada no teste regressivo
    - Aprovada no teste regressivo
    - Controlada
    - Disponível

### US-03 - Registrar histórico do status

**Título da História:** Registrar log de alterações de status da release

**História:**

Como **Sistema**,

eu quero **registrar um novo log a cada alteração de status da release**,

para **termos rastreabilidade**.

**Critérios de Aceitação:**

- Deve ser criada uma tabela ou mecanismo de armazenamento conforme definido em ADR.
- Um novo registro deve ser incluído sempre que ocorrer uma alteração de status da release.
- Não devem existir operações de alteração ou exclusão dos registros, apenas inserções.
- Não será desenvolvida interface de consulta neste momento; a verificação será feita diretamente no banco de dados.

### US-04 - Indicar clientes em Controlado

**Título da História:** Relacionar release a códigos de cliente e ambiente

**História:**

Como **Release Manager**,

eu quero **relacionar uma release a vários códigos de clientes e para cada ambiente deles (homologação ou produção)**,

para **que a API descrita na "US-06 - Listar versões disponíveis", saiba se pode ou não apresentar aquela release para o ambiente solicitado**.

**Critérios de Aceitação:**

- Deve ser possível informar manualmente o código de um ou mais clientes para uma release.
- Deve ser possível associar a cada código de cliente o ambiente correspondente (homologação ou produção).
- A relação entre release, código de cliente e ambiente deve estar disponível para consulta pela API.
- Não deve haver integração com o sistema de licenciamento nem validação do código informado.

### US-05 - Envio de Informações pela pipeline

**Título da História:** Registrar automaticamente a criação de releases via pipeline

**História:**

Como **Release Manager**,

eu quero **que a pipeline envie automaticamente os dados da release para a API do Release Manager assim que o MR da versão for aprovado**,

para **que a nova release seja registrada com o status inicial de “MR Aprovado”, garantindo rastreabilidade e padronização no processo de versionamento**.

**Critérios de Aceitação:**

- A API do Release Manager deve ser acionada automaticamente pela pipeline após a aprovação do MR na branch de versão (Kit, SP ou Patch).
- A requisição deve conter:
    - Nome do produto
    - Versão (major, minor ou patch)
- A release deve ser registrada na API com o status inicial **MR Aprovado**.
- A chamada da API deve ocorrer na etapa de geração de versões da pipeline.

### US-06 - Listar versões disponíveis

**Título da História:** Listar versões disponíveis para atualização da plataforma

**História:**

Como **Release Manager**,

eu quero **listar as versões disponíveis para atualização da Plataforma Shift com release notes e pré-requisitos, para cada cliente e ambiente (homologação ou produção)**,

para **garantir visibilidade sobre as versões que podem ser aplicadas, promovendo atualizações seguras e informadas**.

**Critérios de Aceitação:**

- A listagem deve apresentar as versões disponíveis para atualização para cada cliente, separadas por ambiente (homologação e produção).
- A resposta da API deve conter, para cada versão: número da versão, release notes, pré-requisitos e a URL de download.

### US-07 - Fornecer Pacote

**Título da História:** Fornecer pacote instalável da versão

**História:**

Como **Release Manager**,

eu quero **que o pacote instalável da versão esteja disponível para download**,

para **que o cliente possa realizar a atualização do produto com todos os componentes necessários**.

**Critérios de Aceitação:**

- O sistema deve disponibilizar o pacote da versão (ex: `.zip`, `.tar.gz`) para download.
- O pacote deve conter o produto completo e seus componentes.
    
---

## Backend

### Java Best Practices

### Persona

Você é um desenvolvedor Java moderno, utilizando **Java 21** com **Quarkus** para construir aplicações reativas, 
eficientes e com boot ultrarrápido. Você aplica **arquitetura hexagonal** com forte coesão por feature e baixa 
acoplamento entre camadas. Você preza por legibilidade, testes fáceis, e responsabilidade única. Cada feature é 
isolada com seus próprios ports, use cases, domain model e adapters.

---

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

---

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

---

### Boas Práticas com Quarkus

* Use `@RestPath` e `@RestQuery` para endpoints REST
* Prefira o `PanacheRepository` apenas em adapters
* Use `@Transactional` apenas nos adapters (não em use cases)
* Use configuração via `application.properties`
* Para agendamento, use `@Scheduled`

---

### Naming Conventions

| Camada        | Sufixo/Padrão                |
| ------------- | ---------------------------- |
| Port In       | `XxxUseCase`                 |
| Port Out      | `XxxRepository`, `XxxClient` |
| Use Case Impl | `XxxService`                 |
| Adapter In    | `XxxRestResource`            |
| Adapter Out   | `XxxRestClient`, `XxxJpa`    |
| Model         | `Xxx`, `XxxId`, `XxxEvent`   |

---

### Recursos Úteis

* [Quarkus Guides](https://quarkus.io/guides/)
* [Java 21 Features](https://openjdk.org/projects/jdk/21/)
* [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
* [Ports and Adapters com Quarkus](https://quarkus.io/blog/ports-and-adapters/)

---

## Frontend

- Use Angular framework version 20.
- You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

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