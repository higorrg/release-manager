package com.empresa.app.releasemanagement.adapter.out;

import com.empresa.app.releasemanagement.domain.model.Release;
import com.empresa.app.releasemanagement.domain.model.ReleaseStatus;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "releases")
public class ReleaseEntity extends PanacheEntityBase {

    @Id
    @Column(name = "id")
    public UUID id;

    @Column(name = "product_id", nullable = false)
    public UUID productId;

    @Column(name = "version", nullable = false, length = 100)
    public String version;

    @Column(name = "major_version", nullable = false)
    public Integer majorVersion;

    @Column(name = "minor_version", nullable = false)
    public Integer minorVersion;

    @Column(name = "patch_version", nullable = false)
    public Integer patchVersion;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    public ReleaseStatus status;

    @Column(name = "release_notes", columnDefinition = "TEXT")
    public String releaseNotes;

    @Column(name = "prerequisites", columnDefinition = "TEXT")
    public String prerequisites;

    @Column(name = "download_url", length = 500)
    public String downloadUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;

    public ReleaseEntity() {}

    public static ReleaseEntity from(Release release) {
        var entity = new ReleaseEntity();
        entity.id = release.getId();
        entity.productId = release.getProductId();
        entity.version = release.getVersion();
        entity.majorVersion = release.getMajorVersion();
        entity.minorVersion = release.getMinorVersion();
        entity.patchVersion = release.getPatchVersion();
        entity.status = release.getStatus();
        entity.releaseNotes = release.getReleaseNotes();
        entity.prerequisites = release.getPrerequisites();
        entity.downloadUrl = release.getDownloadUrl();
        entity.createdAt = release.getCreatedAt();
        entity.updatedAt = release.getUpdatedAt();
        return entity;
    }

    public Release toDomain() {
        var release = new Release();
        release.setId(this.id);
        release.setProductId(this.productId);
        release.setVersion(this.version);
        release.setMajorVersion(this.majorVersion);
        release.setMinorVersion(this.minorVersion);
        release.setPatchVersion(this.patchVersion);
        release.setStatus(this.status);
        release.setReleaseNotes(this.releaseNotes);
        release.setPrerequisites(this.prerequisites);
        release.setDownloadUrl(this.downloadUrl);
        release.setCreatedAt(this.createdAt);
        release.setUpdatedAt(this.updatedAt);
        return release;
    }

    public void updateFrom(Release release) {
        this.productId = release.getProductId();
        this.version = release.getVersion();
        this.majorVersion = release.getMajorVersion();
        this.minorVersion = release.getMinorVersion();
        this.patchVersion = release.getPatchVersion();
        this.status = release.getStatus();
        this.releaseNotes = release.getReleaseNotes();
        this.prerequisites = release.getPrerequisites();
        this.downloadUrl = release.getDownloadUrl();
        this.updatedAt = release.getUpdatedAt();
    }
}