package com.releasemanager.releases.domain.model;

import com.releasemanager.clients.domain.model.Client;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.Objects;

@Entity
@Table(name = "release_client_environments", uniqueConstraints = {
    @UniqueConstraint(name = "uk_release_client_environment", 
                     columnNames = {"release_id", "client_id", "environment"})
})
public class ReleaseClientEnvironment extends PanacheEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "release_id", nullable = false)
    public Release release;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    public Client client;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public Environment environment;

    @Column(name = "created_at", nullable = false)
    public ZonedDateTime createdAt;

    public ReleaseClientEnvironment() {
        this.createdAt = ZonedDateTime.now();
    }

    public ReleaseClientEnvironment(Release release, Client client, Environment environment) {
        this();
        this.release = release;
        this.client = client;
        this.environment = environment;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReleaseClientEnvironment that = (ReleaseClientEnvironment) o;
        return Objects.equals(release, that.release) && 
               Objects.equals(client, that.client) && 
               environment == that.environment;
    }

    @Override
    public int hashCode() {
        return Objects.hash(release, client, environment);
    }

    @Override
    public String toString() {
        return "ReleaseClientEnvironment{" +
                "id=" + id +
                ", release=" + (release != null ? release.version : null) +
                ", client=" + (client != null ? client.code : null) +
                ", environment=" + environment +
                '}';
    }
}