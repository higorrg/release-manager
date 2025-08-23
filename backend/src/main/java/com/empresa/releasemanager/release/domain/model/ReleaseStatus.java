package com.empresa.releasemanager.release.domain.model;

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

    private final String description;

    ReleaseStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public boolean isAvailableForClients() {
        return this == DISPONIVEL || this == CONTROLADA;
    }

    public boolean isInTesting() {
        return this == EM_TESTE_SISTEMA || this == EM_TESTE_REGRESSIVO;
    }

    public boolean isFailed() {
        return this == FALHA_BUILD_TESTE || 
               this == FALHA_BUILD_PRODUCAO || 
               this == FALHA_INSTALACAO_ESTAVEL ||
               this == REPROVADA_TESTE ||
               this == REPROVADA_TESTE_REGRESSIVO ||
               this == REVOGADA;
    }
}