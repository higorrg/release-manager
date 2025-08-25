package com.empresa.app.releases.domain.model;

import java.util.Objects;
import java.util.regex.Pattern;

public record ReleaseVersion(String value) {
    
    private static final Pattern VERSION_PATTERN = Pattern.compile(
        "^\\d+\\.\\d+\\.\\d+$"
    );
    
    public ReleaseVersion {
        Objects.requireNonNull(value, "Version cannot be null");
        if (value.trim().isEmpty()) {
            throw new IllegalArgumentException("Version cannot be empty");
        }
        if (!VERSION_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Version deve seguir o padrão x.y.z");
        }
    }
    
    public int getMajor() {
        return Integer.parseInt(value.split("\\.")[0]);
    }
    
    public int getMinor() {
        return Integer.parseInt(value.split("\\.")[1]);
    }
    
    public int getPatch() {
        return Integer.parseInt(value.split("\\.")[2]);
    }
    
    @Override
    public String toString() {
        return value;
    }
}