package br.com.releasemanager.release.domain.model;

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

    public static Environment fromDisplayName(String displayName) {
        for (Environment env : values()) {
            if (env.displayName.equals(displayName)) {
                return env;
            }
        }
        throw new IllegalArgumentException("Unknown environment display name: " + displayName);
    }
}