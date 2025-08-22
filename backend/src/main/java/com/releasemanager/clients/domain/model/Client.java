package com.releasemanager.clients.domain.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.Objects;

@Entity
@Table(name = "clients")
public class Client extends PanacheEntity {

    @Column(unique = true, nullable = false, length = 50)
    public String code;

    @Column(nullable = false)
    public String name;

    @Column(nullable = false)
    public Boolean active = true;

    @Column(name = "created_at", nullable = false)
    public ZonedDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    public ZonedDateTime updatedAt;

    public Client() {
        var now = ZonedDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    public Client(String code, String name) {
        this();
        this.code = code;
        this.name = name;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = ZonedDateTime.now();
    }

    public void activate() {
        this.active = true;
        this.updatedAt = ZonedDateTime.now();
    }

    public void deactivate() {
        this.active = false;
        this.updatedAt = ZonedDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Client client = (Client) o;
        return Objects.equals(code, client.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }

    @Override
    public String toString() {
        return "Client{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", active=" + active +
                '}';
    }
}