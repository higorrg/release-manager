package com.empresa.app.releases.domain.model;

import com.empresa.app.authentication.domain.model.UserId;
import com.empresa.app.shared.domain.ReleaseStatus;

import java.time.LocalDateTime;
import java.util.Objects;

public class Release {
    
    private final ReleaseId id;
    private final ProductName productName;
    private final ReleaseVersion version;
    private ReleaseStatus status;
    private String releaseNotes;
    private String prerequisites;
    private String downloadUrl;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Release(ReleaseId id, ProductName productName, ReleaseVersion version, ReleaseStatus status, 
                   LocalDateTime createdAt) {
        this.id = Objects.requireNonNull(id, "ReleaseId cannot be null");
        this.productName = Objects.requireNonNull(productName, "ProductName cannot be null");
        this.version = Objects.requireNonNull(version, "Version cannot be null");
        this.status = Objects.requireNonNull(status, "ReleaseStatus cannot be null");
        this.createdAt = Objects.requireNonNull(createdAt, "CreatedAt cannot be null");
        this.updatedAt = createdAt;
    }
    
    public static Release create(ProductName productName, ReleaseVersion version) {
        return new Release(
            ReleaseId.generate(),
            productName,
            version,
            ReleaseStatus.MR_APROVADO,
            LocalDateTime.now()
        );
    }
    
    public void updateStatus(ReleaseStatus newStatus, UserId updatedBy) {
        Objects.requireNonNull(newStatus, "New status cannot be null");
        Objects.requireNonNull(updatedBy, "UpdatedBy cannot be null");
        
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
    
    public boolean isAvailableForClient() {
        return status == ReleaseStatus.DISPONIVEL || status == ReleaseStatus.CONTROLADA;
    }
    
    public ReleaseId getId() {
        return id;
    }
    
    public ProductName getProductName() {
        return productName;
    }
    
    public ReleaseVersion getVersion() {
        return version;
    }
    
    public ReleaseStatus getStatus() {
        return status;
    }
    
    public String getReleaseNotes() {
        return releaseNotes;
    }
    
    public String getPrerequisites() {
        return prerequisites;
    }
    
    public String getDownloadUrl() {
        return downloadUrl;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Release release)) return false;
        return Objects.equals(id, release.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}