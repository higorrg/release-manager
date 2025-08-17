package com.empresa.app.release.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class ReleaseClientEnvironment {
    private UUID id;
    private UUID releaseId;
    private UUID clientId;
    private UUID environmentId;
    private LocalDateTime createdAt;

    public ReleaseClientEnvironment() {}

    public ReleaseClientEnvironment(UUID releaseId, UUID clientId, UUID environmentId) {
        this.id = UUID.randomUUID();
        this.releaseId = Objects.requireNonNull(releaseId, "Release ID cannot be null");
        this.clientId = Objects.requireNonNull(clientId, "Client ID cannot be null");
        this.environmentId = Objects.requireNonNull(environmentId, "Environment ID cannot be null");
        this.createdAt = LocalDateTime.now();
    }

    public static ReleaseClientEnvironment create(UUID releaseId, UUID clientId, UUID environmentId) {
        return new ReleaseClientEnvironment(releaseId, clientId, environmentId);
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getReleaseId() { return releaseId; }
    public UUID getClientId() { return clientId; }
    public UUID getEnvironmentId() { return environmentId; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters for JPA
    public void setId(UUID id) { this.id = id; }
    public void setReleaseId(UUID releaseId) { this.releaseId = releaseId; }
    public void setClientId(UUID clientId) { this.clientId = clientId; }
    public void setEnvironmentId(UUID environmentId) { this.environmentId = environmentId; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReleaseClientEnvironment that = (ReleaseClientEnvironment) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "ReleaseClientEnvironment{" +
                "id=" + id +
                ", releaseId=" + releaseId +
                ", clientId=" + clientId +
                ", environmentId=" + environmentId +
                '}';
    }
}