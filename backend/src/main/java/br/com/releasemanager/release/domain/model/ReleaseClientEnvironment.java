package br.com.releasemanager.release.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;

public class ReleaseClientEnvironment {
    private Long id;
    private Long releaseId;
    private String clientCode;
    private Environment environment;
    private LocalDateTime createdAt;

    public ReleaseClientEnvironment() {
        this.createdAt = LocalDateTime.now();
    }

    public ReleaseClientEnvironment(Long releaseId, String clientCode, Environment environment) {
        this();
        this.releaseId = Objects.requireNonNull(releaseId, "Release ID cannot be null");
        this.clientCode = Objects.requireNonNull(clientCode, "Client code cannot be null");
        this.environment = Objects.requireNonNull(environment, "Environment cannot be null");
    }

    public ReleaseClientEnvironment(Long id, Long releaseId, String clientCode, 
                                   Environment environment, LocalDateTime createdAt) {
        this.id = id;
        this.releaseId = Objects.requireNonNull(releaseId, "Release ID cannot be null");
        this.clientCode = Objects.requireNonNull(clientCode, "Client code cannot be null");
        this.environment = Objects.requireNonNull(environment, "Environment cannot be null");
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public Long getReleaseId() { return releaseId; }
    public String getClientCode() { return clientCode; }
    public Environment getEnvironment() { return environment; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters for persistence layer
    public void setId(Long id) { this.id = id; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReleaseClientEnvironment that = (ReleaseClientEnvironment) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(releaseId, that.releaseId) &&
               Objects.equals(clientCode, that.clientCode) &&
               environment == that.environment;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, releaseId, clientCode, environment);
    }

    @Override
    public String toString() {
        return "ReleaseClientEnvironment{" +
               "id=" + id +
               ", releaseId=" + releaseId +
               ", clientCode='" + clientCode + '\'' +
               ", environment=" + environment +
               ", createdAt=" + createdAt +
               '}';
    }
}