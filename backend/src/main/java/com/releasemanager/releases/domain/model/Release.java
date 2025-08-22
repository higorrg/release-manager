package com.releasemanager.releases.domain.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.Objects;

@Entity
@Table(name = "releases", uniqueConstraints = {
    @UniqueConstraint(name = "uk_releases_product_version", columnNames = {"product_id", "version"})
})
public class Release extends PanacheEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    public Product product;

    @Column(nullable = false, length = 50)
    public String version;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    public ReleaseStatus status;

    @Column(name = "release_notes", columnDefinition = "TEXT")
    public String releaseNotes;

    @Column(columnDefinition = "TEXT")
    public String prerequisites;

    @Column(name = "download_url", length = 500)
    public String downloadUrl;

    @Column(name = "created_at", nullable = false)
    public ZonedDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    public ZonedDateTime updatedAt;

    public Release() {
        var now = ZonedDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        this.status = ReleaseStatus.MR_APROVADO;
    }

    public Release(Product product, String version) {
        this();
        this.product = product;
        this.version = version;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = ZonedDateTime.now();
    }

    public void updateStatus(ReleaseStatus newStatus) {
        this.status = newStatus;
        this.updatedAt = ZonedDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Release release = (Release) o;
        return Objects.equals(product, release.product) && 
               Objects.equals(version, release.version);
    }

    @Override
    public int hashCode() {
        return Objects.hash(product, version);
    }

    @Override
    public String toString() {
        return "Release{" +
                "id=" + id +
                ", version='" + version + '\'' +
                ", status=" + status +
                ", product=" + (product != null ? product.name : null) +
                '}';
    }
}