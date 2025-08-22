package com.empresa.app.clientmanagement.adapter.out;

import com.empresa.app.clientmanagement.domain.model.Client;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "clients")
public class ClientEntity extends PanacheEntityBase {

    @Id
    @Column(name = "id")
    public UUID id;

    @Column(name = "client_code", nullable = false, unique = true, length = 100)
    public String clientCode;

    @Column(name = "name", nullable = false, length = 255)
    public String name;

    @Column(name = "description", columnDefinition = "TEXT")
    public String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;

    public ClientEntity() {}

    public static ClientEntity from(Client client) {
        var entity = new ClientEntity();
        entity.id = client.getId();
        entity.clientCode = client.getClientCode();
        entity.name = client.getName();
        entity.description = client.getDescription();
        entity.createdAt = client.getCreatedAt();
        entity.updatedAt = client.getUpdatedAt();
        return entity;
    }

    public Client toDomain() {
        var client = new Client();
        client.setId(this.id);
        client.setClientCode(this.clientCode);
        client.setName(this.name);
        client.setDescription(this.description);
        client.setCreatedAt(this.createdAt);
        client.setUpdatedAt(this.updatedAt);
        return client;
    }
}