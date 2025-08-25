package com.empresa.app.releases.domain.model;

import java.util.Objects;
import java.util.UUID;

public record ReleaseHistoryId(UUID value) {
    
    public ReleaseHistoryId {
        Objects.requireNonNull(value, "ReleaseHistoryId cannot be null");
    }
    
    public static ReleaseHistoryId generate() {
        return new ReleaseHistoryId(UUID.randomUUID());
    }
    
    public static ReleaseHistoryId of(String value) {
        return new ReleaseHistoryId(UUID.fromString(value));
    }
    
    @Override
    public String toString() {
        return value.toString();
    }
}