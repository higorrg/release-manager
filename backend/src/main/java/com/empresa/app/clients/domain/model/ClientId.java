package com.empresa.app.clients.domain.model;

import java.util.Objects;
import java.util.UUID;

public record ClientId(UUID value) {
    
    public ClientId {
        Objects.requireNonNull(value, "ClientId cannot be null");
    }
    
    public static ClientId generate() {
        return new ClientId(UUID.randomUUID());
    }
    
    public static ClientId of(String value) {
        return new ClientId(UUID.fromString(value));
    }
    
    @Override
    public String toString() {
        return value.toString();
    }
}