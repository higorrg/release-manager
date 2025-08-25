package com.empresa.app.authentication.domain.model;

import java.util.Objects;

public record Password(String value) {
    
    public Password {
        Objects.requireNonNull(value, "Password cannot be null");
        if (value.length() < 16) {
            throw new IllegalArgumentException("Senha deve ter no mínimo 16 caracteres");
        }
    }
    
    @Override
    public String toString() {
        return "Password{***}";
    }
}