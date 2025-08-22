package com.empresa.app.clientmanagement.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class Environment {
    private UUID id;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    public Environment() {}

    public Environment(String name) {
        this.id = UUID.randomUUID();
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.createdAt = LocalDateTime.now();
    }

    public static Environment create(String name) {
        return new Environment(name);
    }

    public void updateDescription(String description) {
        this.description = description;
    }

    public boolean isProduction() {
        return "PRODUCAO".equalsIgnoreCase(this.name);
    }

    public boolean isHomologation() {
        return "HOMOLOGACAO".equalsIgnoreCase(this.name);
    }

    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters for JPA
    public void setId(UUID id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Environment that = (Environment) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Environment{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}