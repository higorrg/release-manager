package com.empresa.app.releasemanagement.adapter.out;

import com.empresa.app.releasemanagement.domain.model.ReleaseClientEnvironment;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "release_client_environments")
public class ReleaseClientEnvironmentEntity extends PanacheEntityBase {

    @Id
    @Column(name = "id")
    public UUID id;

    @Column(name = "release_id", nullable = false)
    public UUID releaseId;

    @Column(name = "client_id", nullable = false)
    public UUID clientId;

    @Column(name = "environment_id", nullable = false)
    public UUID environmentId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt;

    public ReleaseClientEnvironmentEntity() {}

    public static ReleaseClientEnvironmentEntity from(ReleaseClientEnvironment rce) {
        var entity = new ReleaseClientEnvironmentEntity();
        entity.id = rce.getId();
        entity.releaseId = rce.getReleaseId();
        entity.clientId = rce.getClientId();
        entity.environmentId = rce.getEnvironmentId();
        entity.createdAt = rce.getCreatedAt();
        return entity;
    }

    public ReleaseClientEnvironment toDomain() {
        var rce = new ReleaseClientEnvironment();
        rce.setId(this.id);
        rce.setReleaseId(this.releaseId);
        rce.setClientId(this.clientId);
        rce.setEnvironmentId(this.environmentId);
        rce.setCreatedAt(this.createdAt);
        return rce;
    }
}