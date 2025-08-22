package com.releasemanager.releases.domain.model;

public enum Environment {
    HOMOLOGACAO("homologacao"),
    PRODUCAO("producao");

    private final String value;

    Environment(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Environment fromValue(String value) {
        for (Environment env : values()) {
            if (env.value.equals(value)) {
                return env;
            }
        }
        throw new IllegalArgumentException("Ambiente não encontrado: " + value);
    }
}