package com.empresa.app.clients.domain.model;

import java.util.Objects;

public record ClientCode(String value) {
    
    public ClientCode {
        Objects.requireNonNull(value, "ClientCode cannot be null");
        if (value.trim().isEmpty()) {
            throw new IllegalArgumentException("ClientCode cannot be empty");
        }
        if (value.length() > 50) {
            throw new IllegalArgumentException("ClientCode cannot be longer than 50 characters");
        }
    }
    
    @Override
    public String toString() {
        return value;
    }
}