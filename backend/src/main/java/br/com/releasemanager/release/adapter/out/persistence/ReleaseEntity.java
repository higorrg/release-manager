package br.com.releasemanager.release.adapter.out.persistence;

import br.com.releasemanager.release.domain.model.Release;
import br.com.releasemanager.release.domain.model.ReleaseStatus;
import br.com.releasemanager.release.domain.model.Version;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "releases")
public class ReleaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "version_major", nullable = false)
    private Integer versionMajor;

    @Column(name = "version_minor", nullable = false)
    private Integer versionMinor;

    @Column(name = "version_patch", nullable = false)
    private Integer versionPatch;

    @Column(name = "version_full", nullable = false)
    private String versionFull;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false)
    private ReleaseStatus currentStatus;

    @Column(name = "release_notes", columnDefinition = "TEXT")
    private String releaseNotes;

    @Column(name = "prerequisites", columnDefinition = "TEXT")
    private String prerequisites;

    @Column(name = "download_url")
    private String downloadUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ReleaseEntity() {}

    public ReleaseEntity(Release release) {
        this.id = release.getId();
        this.productName = release.getProductName();
        this.versionMajor = release.getVersion().major();
        this.versionMinor = release.getVersion().minor();
        this.versionPatch = release.getVersion().patch();
        this.versionFull = release.getVersion().getFullVersion();
        this.currentStatus = release.getCurrentStatus();
        this.releaseNotes = release.getReleaseNotes();
        this.prerequisites = release.getPrerequisites();
        this.downloadUrl = release.getDownloadUrl();
        this.createdAt = release.getCreatedAt();
        this.updatedAt = release.getUpdatedAt();
    }

    public Release toDomain() {
        Version version = new Version(versionMajor, versionMinor, versionPatch);
        return new Release(id, productName, version, currentStatus, 
                          releaseNotes, prerequisites, downloadUrl, 
                          createdAt, updatedAt);
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getVersionMajor() { return versionMajor; }
    public void setVersionMajor(Integer versionMajor) { this.versionMajor = versionMajor; }

    public Integer getVersionMinor() { return versionMinor; }
    public void setVersionMinor(Integer versionMinor) { this.versionMinor = versionMinor; }

    public Integer getVersionPatch() { return versionPatch; }
    public void setVersionPatch(Integer versionPatch) { this.versionPatch = versionPatch; }

    public String getVersionFull() { return versionFull; }
    public void setVersionFull(String versionFull) { this.versionFull = versionFull; }

    public ReleaseStatus getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(ReleaseStatus currentStatus) { this.currentStatus = currentStatus; }

    public String getReleaseNotes() { return releaseNotes; }
    public void setReleaseNotes(String releaseNotes) { this.releaseNotes = releaseNotes; }

    public String getPrerequisites() { return prerequisites; }
    public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }

    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReleaseEntity that = (ReleaseEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}