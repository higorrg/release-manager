package com.empresa.app.shared.domain;

public enum UserRole {
    ADMIN("admin"),
    READ_ONLY("read_only");

    private final String value;

    UserRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}