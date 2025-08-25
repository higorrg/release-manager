package com.empresa.app.releases.domain.model;

import com.empresa.app.clients.domain.model.ClientCode;
import com.empresa.app.shared.domain.Environment;

import java.time.LocalDateTime;
import java.util.Objects;

public class ReleaseClientEnvironment {
    
    private final ReleaseClientEnvironmentId id;
    private final ReleaseId releaseId;
    private final ClientCode clientCode;
    private final Environment environment;
    private final LocalDateTime createdAt;
    
    public ReleaseClientEnvironment(ReleaseClientEnvironmentId id, ReleaseId releaseId,
                                   ClientCode clientCode, Environment environment,
                                   LocalDateTime createdAt) {
        this.id = Objects.requireNonNull(id, "ReleaseClientEnvironmentId cannot be null");
        this.releaseId = Objects.requireNonNull(releaseId, "ReleaseId cannot be null");
        this.clientCode = Objects.requireNonNull(clientCode, "ClientCode cannot be null");
        this.environment = Objects.requireNonNull(environment, "Environment cannot be null");
        this.createdAt = Objects.requireNonNull(createdAt, "CreatedAt cannot be null");
    }
    
    public static ReleaseClientEnvironment create(ReleaseId releaseId, ClientCode clientCode,
                                                 Environment environment) {
        return new ReleaseClientEnvironment(
            ReleaseClientEnvironmentId.generate(),
            releaseId,
            clientCode,
            environment,
            LocalDateTime.now()
        );
    }
    
    public ReleaseClientEnvironmentId getId() {
        return id;
    }
    
    public ReleaseId getReleaseId() {
        return releaseId;
    }
    
    public ClientCode getClientCode() {
        return clientCode;
    }
    
    public Environment getEnvironment() {
        return environment;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReleaseClientEnvironment that)) return false;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}