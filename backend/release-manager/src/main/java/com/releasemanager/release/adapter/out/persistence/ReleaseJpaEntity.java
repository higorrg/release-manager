package com.releasemanager.release.adapter.out.persistence;

import com.releasemanager.release.domain.model.ReleaseStatus;
import com.releasemanager.release.domain.model.ReleaseType;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "releases")
public class ReleaseJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String version;

    @Enumerated(EnumType.STRING)
    private ReleaseType type;

    private String branch;
    private String commitHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReleaseStatus currentStatus;

    @Lob
    private String releaseNotes;

    @Lob
    private String prerequisites;

    private String downloadUrl;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public ReleaseType getType() { return type; }
    public void setType(ReleaseType type) { this.type = type; }
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    public String getCommitHash() { return commitHash; }
    public void setCommitHash(String commitHash) { this.commitHash = commitHash; }
    public ReleaseStatus getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(ReleaseStatus currentStatus) { this.currentStatus = currentStatus; }
    public String getReleaseNotes() { return releaseNotes; }
    public void setReleaseNotes(String releaseNotes) { this.releaseNotes = releaseNotes; }
    public String getPrerequisites() { return prerequisites; }
    public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }
    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
