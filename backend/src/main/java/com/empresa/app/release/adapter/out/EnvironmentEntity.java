package com.empresa.app.release.adapter.out;

import com.empresa.app.release.domain.model.Environment;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "environments")
public class EnvironmentEntity extends PanacheEntityBase {

    @Id
    @Column(name = "id")
    public UUID id;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    public String name;

    @Column(name = "description", columnDefinition = "TEXT")
    public String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt;

    public EnvironmentEntity() {}

    public static EnvironmentEntity from(Environment environment) {
        var entity = new EnvironmentEntity();
        entity.id = environment.getId();
        entity.name = environment.getName();
        entity.description = environment.getDescription();
        entity.createdAt = environment.getCreatedAt();
        return entity;
    }

    public Environment toDomain() {
        var environment = new Environment();
        environment.setId(this.id);
        environment.setName(this.name);
        environment.setDescription(this.description);
        environment.setCreatedAt(this.createdAt);
        return environment;
    }
}