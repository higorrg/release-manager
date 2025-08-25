package com.empresa.app.releases.domain.model;

import java.util.Objects;
import java.util.UUID;

public record ReleaseId(UUID value) {
    
    public ReleaseId {
        Objects.requireNonNull(value, "ReleaseId cannot be null");
    }
    
    public static ReleaseId generate() {
        return new ReleaseId(UUID.randomUUID());
    }
    
    public static ReleaseId of(String value) {
        return new ReleaseId(UUID.fromString(value));
    }
    
    @Override
    public String toString() {
        return value.toString();
    }
}