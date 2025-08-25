package com.empresa.app.releases.domain.model;

import java.util.Objects;
import java.util.UUID;

public record ReleaseClientEnvironmentId(UUID value) {
    
    public ReleaseClientEnvironmentId {
        Objects.requireNonNull(value, "ReleaseClientEnvironmentId cannot be null");
    }
    
    public static ReleaseClientEnvironmentId generate() {
        return new ReleaseClientEnvironmentId(UUID.randomUUID());
    }
    
    public static ReleaseClientEnvironmentId of(String value) {
        return new ReleaseClientEnvironmentId(UUID.fromString(value));
    }
    
    @Override
    public String toString() {
        return value.toString();
    }
}