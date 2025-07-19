package br.com.releasemanager.release.adapter.out.persistence;

import br.com.releasemanager.release.domain.model.Environment;
import br.com.releasemanager.release.domain.model.ReleaseClientEnvironment;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "release_client_environments")
public class ReleaseClientEnvironmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "release_id", nullable = false)
    private Long releaseId;

    @Column(name = "client_code", nullable = false)
    private String clientCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "environment", nullable = false)
    private Environment environment;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public ReleaseClientEnvironmentEntity() {}

    public ReleaseClientEnvironmentEntity(ReleaseClientEnvironment clientEnvironment) {
        this.id = clientEnvironment.getId();
        this.releaseId = clientEnvironment.getReleaseId();
        this.clientCode = clientEnvironment.getClientCode();
        this.environment = clientEnvironment.getEnvironment();
        this.createdAt = clientEnvironment.getCreatedAt();
    }

    public ReleaseClientEnvironment toDomain() {
        return new ReleaseClientEnvironment(id, releaseId, clientCode, environment, createdAt);
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReleaseId() { return releaseId; }
    public void setReleaseId(Long releaseId) { this.releaseId = releaseId; }

    public String getClientCode() { return clientCode; }
    public void setClientCode(String clientCode) { this.clientCode = clientCode; }

    public Environment getEnvironment() { return environment; }
    public void setEnvironment(Environment environment) { this.environment = environment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReleaseClientEnvironmentEntity that = (ReleaseClientEnvironmentEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}