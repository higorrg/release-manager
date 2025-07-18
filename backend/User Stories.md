# User Stories

## US-01 - Segurança

**Título da História:** Segurança (Autenticação e Autorização)

**História:**

Como **Release Manager**,

eu quero **autenticar-me na aplicação utilizando login via SSO integrado ao AzureAD**,

para **acessar o sistema com segurança e praticidade, aproveitando as credenciais corporativas já existentes**.

**Critérios de Aceitação:**

- A tela de login deve redirecionar o usuário para autenticação via AzureAD.
- Apenas usuários autorizados no AzureAD devem conseguir acessar o sistema.
- Após login bem-sucedido, o usuário deve ser redirecionado automaticamente à tela principal da aplicação.

## US-02 - Controlar status de cada etapa da release

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

## US-03 - Registrar histórico do status

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

## US-04 - Indicar clientes em Controlado

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

## US-05 - Envio de Informações pela pipeline

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

## US-06 - Listar versões disponíveis

**Título da História:** Listar versões disponíveis para atualização da plataforma

**História:**

Como **Release Manager**,

eu quero **listar as versões disponíveis para atualização da Plataforma Shift com release notes e pré-requisitos, para cada cliente e ambiente (homologação ou produção)**,

para **garantir visibilidade sobre as versões que podem ser aplicadas, promovendo atualizações seguras e informadas**.

**Critérios de Aceitação:**

- A listagem deve apresentar as versões disponíveis para atualização para cada cliente, separadas por ambiente (homologação e produção).
- A resposta da API deve conter, para cada versão: número da versão, release notes, pré-requisitos e a URL de download.

## US-07 - Fornecer Pacote

**Título da História:** Fornecer pacote instalável da versão

**História:**

Como **Release Manager**,

eu quero **que o pacote instalável da versão esteja disponível para download**,

para **que o cliente possa realizar a atualização do produto com todos os componentes necessários**.

**Critérios de Aceitação:**

- O sistema deve disponibilizar o pacote da versão (ex: `.zip`, `.tar.gz`) para download.
- O pacote deve conter o produto completo e seus componentes.