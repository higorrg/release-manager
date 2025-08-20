package com.releasemanager.release.domain.model;

import java.util.stream.Stream;

public enum ReleaseStatus {
    MR_APROVADO("MR Aprovado"),
    FALHA_NO_BUILD_PARA_TESTE("Falha no Build para Teste"),
    PARA_TESTE_DE_SISTEMA("Para Teste de Sistema"),
    REPROVADA_NO_TESTE("Reprovada no teste"),
    APROVADA_NO_TESTE("Aprovada no teste"),
    FALHA_NO_BUILD_PARA_PRODUCAO("Falha no Build para Produção"),
    PARA_TESTE_REGRESSIVO("Para Teste Regressivo"),
    FALHA_NA_INSTALACAO_DA_ESTAVEL("Falha na instalação da Estável"),
    INTERNO("Interno"),
    REVOGADA("Revogada"),
    REPROVADA_NO_TESTE_REGRESSIVO("Reprovada no teste regressivo"),
    APROVADA_NO_TESTE_REGRESSIVO("Aprovada no teste regressivo"),
    CONTROLADA("Controlada"),
    DISPONIVEL("Disponível");

    private final String description;

    ReleaseStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public static ReleaseStatus fromDescription(String description) {
        return Stream.of(values())
            .filter(status -> status.description.equalsIgnoreCase(description))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Unknown status description: " + description));
    }
}
