package com.empresa.app.shared.domain;

public enum ReleaseStatus {
    MR_APROVADO("MR Aprovado"),
    FALHA_BUILD_TESTE("Falha no Build para Teste"),
    PARA_TESTE_SISTEMA("Para Teste de Sistema"),
    EM_TESTE_SISTEMA("Em Teste de Sistema"),
    REPROVADA_TESTE("Reprovada no teste"),
    APROVADA_TESTE("Aprovada no teste"),
    FALHA_BUILD_PRODUCAO("Falha no Build para Produção"),
    PARA_TESTE_REGRESSIVO("Para Teste Regressivo"),
    EM_TESTE_REGRESSIVO("Em Teste Regressivo"),
    FALHA_INSTALACAO_ESTAVEL("Falha na instalação da Estável"),
    INTERNO("Interno"),
    REVOGADA("Revogada"),
    REPROVADA_TESTE_REGRESSIVO("Reprovada no teste regressivo"),
    APROVADA_TESTE_REGRESSIVO("Aprovada no teste regressivo"),
    CONTROLADA("Controlada"),
    DISPONIVEL("Disponível");

    private final String displayName;

    ReleaseStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}