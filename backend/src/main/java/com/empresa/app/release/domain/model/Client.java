package com.empresa.app.release.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class Client {
    private UUID id;
    private String clientCode;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Client() {}

    public Client(String clientCode, String name) {
        this.id = UUID.randomUUID();
        this.clientCode = Objects.requireNonNull(clientCode, "Client code cannot be null");
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Client(String clientCode, String name, String description) {
        this.id = UUID.randomUUID();
        this.clientCode = Objects.requireNonNull(clientCode, "Client code cannot be null");
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.description = description;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public static Client create(String clientCode, String name) {
        return new Client(clientCode, name);
    }

    public static Client create(String clientCode, String name, String description) {
        return new Client(clientCode, name, description);
    }

    public void updateName(String name) {
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.updatedAt = LocalDateTime.now();
    }

    public void updateDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters
    public UUID getId() { return id; }
    public String getClientCode() { return clientCode; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters for JPA
    public void setId(UUID id) { this.id = id; }
    public void setClientCode(String clientCode) { this.clientCode = clientCode; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Client client = (Client) o;
        return Objects.equals(id, client.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Client{" +
                "id=" + id +
                ", clientCode='" + clientCode + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}