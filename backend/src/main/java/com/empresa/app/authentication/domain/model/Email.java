package com.empresa.app.authentication.domain.model;

import java.util.Objects;
import java.util.regex.Pattern;

public record Email(String value) {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@empresa\\.com\\.br$"
    );
    
    public Email {
        Objects.requireNonNull(value, "Email cannot be null");
        if (value.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (!EMAIL_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Email deve pertencer ao domínio @empresa.com.br");
        }
    }
    
    @Override
    public String toString() {
        return value;
    }
}