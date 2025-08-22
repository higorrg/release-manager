package com.releasemanager.releases.domain.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.Objects;

@Entity
@Table(name = "products")
public class Product extends PanacheEntity {

    @Column(unique = true, nullable = false)
    public String name;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(name = "created_at", nullable = false)
    public ZonedDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    public ZonedDateTime updatedAt;

    public Product() {
        var now = ZonedDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    public Product(String name, String description) {
        this();
        this.name = name;
        this.description = description;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = ZonedDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return Objects.equals(name, product.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}