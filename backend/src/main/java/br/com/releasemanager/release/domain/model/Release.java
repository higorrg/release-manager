package br.com.releasemanager.release.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;

public class Release {
    private Long id;
    private String productName;
    private Version version;
    private ReleaseStatus currentStatus;
    private String releaseNotes;
    private String prerequisites;
    private String downloadUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Release() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.currentStatus = ReleaseStatus.MR_APROVADO;
    }

    public Release(String productName, Version version) {
        this();
        this.productName = Objects.requireNonNull(productName, "Product name cannot be null");
        this.version = Objects.requireNonNull(version, "Version cannot be null");
    }

    public Release(Long id, String productName, Version version, ReleaseStatus currentStatus,
                   String releaseNotes, String prerequisites, String downloadUrl,
                   LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.productName = Objects.requireNonNull(productName, "Product name cannot be null");
        this.version = Objects.requireNonNull(version, "Version cannot be null");
        this.currentStatus = Objects.requireNonNull(currentStatus, "Status cannot be null");
        this.releaseNotes = releaseNotes;
        this.prerequisites = prerequisites;
        this.downloadUrl = downloadUrl;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
    }

    public void changeStatus(ReleaseStatus newStatus) {
        Objects.requireNonNull(newStatus, "New status cannot be null");
        this.currentStatus = newStatus;
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

    public boolean isAvailableForEnvironment(Environment environment) {
        return switch (environment) {
            case HOMOLOGACAO -> currentStatus == ReleaseStatus.APROVADA_TESTE ||
                              currentStatus == ReleaseStatus.PARA_TESTE_REGRESSIVO ||
                              currentStatus == ReleaseStatus.APROVADA_TESTE_REGRESSIVO ||
                              currentStatus == ReleaseStatus.CONTROLADA ||
                              currentStatus == ReleaseStatus.DISPONIVEL;
            case PRODUCAO -> currentStatus == ReleaseStatus.CONTROLADA ||
                           currentStatus == ReleaseStatus.DISPONIVEL;
        };
    }

    // Getters
    public Long getId() { return id; }
    public String getProductName() { return productName; }
    public Version getVersion() { return version; }
    public ReleaseStatus getCurrentStatus() { return currentStatus; }
    public String getReleaseNotes() { return releaseNotes; }
    public String getPrerequisites() { return prerequisites; }
    public String getDownloadUrl() { return downloadUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters for persistence layer
    public void setId(Long id) { this.id = id; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Release release = (Release) o;
        return Objects.equals(id, release.id) &&
               Objects.equals(productName, release.productName) &&
               Objects.equals(version, release.version);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, productName, version);
    }

    @Override
    public String toString() {
        return "Release{" +
               "id=" + id +
               ", productName='" + productName + '\'' +
               ", version=" + version +
               ", currentStatus=" + currentStatus +
               ", createdAt=" + createdAt +
               '}';
    }
}