package com.empresa.releasemanager.release.domain.model;

public enum Environment {
    HOMOLOGACAO("Homologação"),
    PRODUCAO("Produção");

    private final String description;

    Environment(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}