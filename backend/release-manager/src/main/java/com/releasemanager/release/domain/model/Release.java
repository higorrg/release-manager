package com.releasemanager.release.domain.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.Objects;

public class Release {

    private UUID id;
    private String productName;
    private String version;
    private ReleaseType type;
    private String branch;
    private String commitHash;
    private ReleaseStatus currentStatus;
    private String releaseNotes;
    private String prerequisites;
    private String downloadUrl;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public Release(UUID id, String productName, String version, ReleaseStatus currentStatus) {
        this.id = Objects.requireNonNull(id, "id cannot be null");
        this.productName = Objects.requireNonNull(productName, "productName cannot be null");
        this.version = Objects.requireNonNull(version, "version cannot be null");
        this.currentStatus = Objects.requireNonNull(currentStatus, "currentStatus cannot be null");
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public ReleaseType getType() {
        return type;
    }

    public void setType(ReleaseType type) {
        this.type = type;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getCommitHash() {
        return commitHash;
    }

    public void setCommitHash(String commitHash) {
        this.commitHash = commitHash;
    }

    public ReleaseStatus getCurrentStatus() {
        return currentStatus;
    }

    public void setCurrentStatus(ReleaseStatus currentStatus) {
        this.currentStatus = currentStatus;
    }

    public String getReleaseNotes() {
        return releaseNotes;
    }

    public void setReleaseNotes(String releaseNotes) {
        this.releaseNotes = releaseNotes;
    }

    public String getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(String prerequisites) {
        this.prerequisites = prerequisites;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
