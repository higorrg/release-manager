package com.empresa.app.release.domain.model;

public enum ReleaseStatus {
    MR_APROVADO("MR Aprovado"),
    FALHA_BUILD_TESTE("Falha no Build para Teste"),
    PARA_TESTE_SISTEMA("Para Teste de Sistema"),
    REPROVADA_TESTE("Reprovada no teste"),
    APROVADA_TESTE("Aprovada no teste"),
    FALHA_BUILD_PRODUCAO("Falha no Build para Produção"),
    PARA_TESTE_REGRESSIVO("Para Teste Regressivo"),
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

    public boolean isTestPhase() {
        return this == PARA_TESTE_SISTEMA || 
               this == PARA_TESTE_REGRESSIVO ||
               this == REPROVADA_TESTE ||
               this == REPROVADA_TESTE_REGRESSIVO;
    }

    public boolean isApproved() {
        return this == APROVADA_TESTE || 
               this == APROVADA_TESTE_REGRESSIVO;
    }

    public boolean isFailed() {
        return this == FALHA_BUILD_TESTE || 
               this == FALHA_BUILD_PRODUCAO ||
               this == FALHA_INSTALACAO_ESTAVEL ||
               this == REPROVADA_TESTE ||
               this == REPROVADA_TESTE_REGRESSIVO;
    }

    public boolean isFinalized() {
        return this == CONTROLADA || 
               this == DISPONIVEL ||
               this == REVOGADA;
    }

    @Override
    public String toString() {
        return displayName;
    }
}