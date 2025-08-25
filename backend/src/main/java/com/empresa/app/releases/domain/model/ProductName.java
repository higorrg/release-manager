package com.empresa.app.releases.domain.model;

import java.util.Objects;

public record ProductName(String value) {
    
    public ProductName {
        Objects.requireNonNull(value, "ProductName cannot be null");
        if (value.trim().isEmpty()) {
            throw new IllegalArgumentException("ProductName cannot be empty");
        }
    }
    
    @Override
    public String toString() {
        return value;
    }
}