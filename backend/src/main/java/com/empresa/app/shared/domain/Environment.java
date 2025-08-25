package com.empresa.app.shared.domain;

public enum Environment {
    HOMOLOGACAO("Homologação"),
    PRODUCAO("Produção");

    private final String displayName;

    Environment(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}