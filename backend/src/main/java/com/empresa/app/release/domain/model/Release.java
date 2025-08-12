package com.empresa.app.release.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class Release {
    private UUID id;
    private UUID productId;
    private String version;
    private Integer majorVersion;
    private Integer minorVersion;
    private Integer patchVersion;
    private ReleaseStatus status;
    private String releaseNotes;
    private String prerequisites;
    private String downloadUrl;
    private String packagePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Release() {}

    public Release(UUID productId, String version, ReleaseStatus status) {
        this.id = UUID.randomUUID();
        this.productId = Objects.requireNonNull(productId, "Product ID cannot be null");
        this.version = Objects.requireNonNull(version, "Version cannot be null");
        this.status = Objects.requireNonNull(status, "Status cannot be null");
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        parseVersion(version);
    }

    public static Release create(UUID productId, String version) {
        return new Release(productId, version, ReleaseStatus.MR_APROVADO);
    }

    public void updateStatus(ReleaseStatus newStatus) {
        if (Objects.isNull(newStatus)) {
            throw new IllegalArgumentException("New status cannot be null");
        }
        this.status = newStatus;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateReleaseNotes(String releaseNotes) {
        this.releaseNotes = releaseNotes;
        this.updatedAt = LocalDateTime.now();
    }

    public void updatePrerequisites(String prerequisites) {
        this.prerequisites = prerequisites;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
        this.updatedAt = LocalDateTime.now();
    }

    public void updatePackagePath(String packagePath) {
        this.packagePath = packagePath;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isAvailable() {
        return status == ReleaseStatus.DISPONIVEL;
    }

    public boolean isControlled() {
        return status == ReleaseStatus.CONTROLADA;
    }

    private void parseVersion(String version) {
        if (Objects.isNull(version) || version.trim().isEmpty()) {
            throw new IllegalArgumentException("Version cannot be null or empty");
        }

        var parts = version.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Version must follow semantic versioning (major.minor.patch)");
        }

        try {
            this.majorVersion = Integer.parseInt(parts[0]);
            this.minorVersion = Integer.parseInt(parts[1]);
            this.patchVersion = Integer.parseInt(parts[2]);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Version parts must be integers", e);
        }

        if (this.majorVersion < 0 || this.minorVersion < 0 || this.patchVersion < 0) {
            throw new IllegalArgumentException("Version parts cannot be negative");
        }
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getProductId() { return productId; }
    public String getVersion() { return version; }
    public Integer getMajorVersion() { return majorVersion; }
    public Integer getMinorVersion() { return minorVersion; }
    public Integer getPatchVersion() { return patchVersion; }
    public ReleaseStatus getStatus() { return status; }
    public String getReleaseNotes() { return releaseNotes; }
    public String getPrerequisites() { return prerequisites; }
    public String getDownloadUrl() { return downloadUrl; }
    public String getPackagePath() { return packagePath; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters for JPA
    public void setId(UUID id) { this.id = id; }
    public void setProductId(UUID productId) { this.productId = productId; }
    public void setVersion(String version) { this.version = version; }
    public void setMajorVersion(Integer majorVersion) { this.majorVersion = majorVersion; }
    public void setMinorVersion(Integer minorVersion) { this.minorVersion = minorVersion; }
    public void setPatchVersion(Integer patchVersion) { this.patchVersion = patchVersion; }
    public void setStatus(ReleaseStatus status) { this.status = status; }
    public void setReleaseNotes(String releaseNotes) { this.releaseNotes = releaseNotes; }
    public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    public void setPackagePath(String packagePath) { this.packagePath = packagePath; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Release release = (Release) o;
        return Objects.equals(id, release.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Release{" +
                "id=" + id +
                ", version='" + version + '\'' +
                ", status=" + status +
                '}';
    }
}