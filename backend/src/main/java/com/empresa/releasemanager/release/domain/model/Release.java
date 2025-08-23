package com.empresa.releasemanager.release.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "releases", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"product_name", "version"})
})
public class Release {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "product_name", nullable = false)
    private String productName;

    @NotBlank
    @Column(name = "version", nullable = false)
    private String version;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "version_type", nullable = false)
    private VersionType versionType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReleaseStatus status = ReleaseStatus.MR_APROVADO;

    @Column(name = "branch_name")
    private String branchName;

    @Column(name = "commit_hash")
    private String commitHash;

    @Column(name = "release_notes", columnDefinition = "TEXT")
    private String releaseNotes;

    @Column(name = "prerequisites", columnDefinition = "TEXT")
    private String prerequisites;

    @Column(name = "package_url")
    private String packageUrl;

    @OneToMany(mappedBy = "release", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ReleaseStatusHistory> statusHistory = new ArrayList<>();

    @OneToMany(mappedBy = "release", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ReleaseClientEnvironment> clientEnvironments = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    // Constructors
    public Release() {}

    public Release(String productName, String version, VersionType versionType) {
        this.productName = productName;
        this.version = version;
        this.versionType = versionType;
    }

    // Business methods
    public void updateStatus(ReleaseStatus newStatus, String reason, String updatedBy) {
        if (this.status == newStatus) {
            return; // No change needed
        }

        ReleaseStatus previousStatus = this.status;
        this.status = newStatus;
        this.updatedBy = updatedBy;

        // Add to history
        ReleaseStatusHistory historyEntry = new ReleaseStatusHistory(
            this, previousStatus, newStatus, reason, updatedBy
        );
        this.statusHistory.add(historyEntry);
    }

    public void addClientEnvironment(String clientCode, Environment environment) {
        // Check for duplicates
        boolean exists = clientEnvironments.stream()
            .anyMatch(ce -> ce.getClientCode().equals(clientCode) && 
                          ce.getEnvironment() == environment);
        
        if (exists) {
            throw new IllegalArgumentException(
                "Client " + clientCode + " already exists for environment " + environment
            );
        }

        ReleaseClientEnvironment clientEnv = new ReleaseClientEnvironment(this, clientCode, environment);
        clientEnvironments.add(clientEnv);
    }

    public void removeClientEnvironment(String clientCode, Environment environment) {
        clientEnvironments.removeIf(ce -> 
            ce.getClientCode().equals(clientCode) && 
            ce.getEnvironment() == environment
        );
    }

    public boolean isAvailableForClient(String clientCode, Environment environment) {
        if (!status.isAvailableForClients()) {
            return false;
        }

        return clientEnvironments.stream()
            .anyMatch(ce -> ce.getClientCode().equals(clientCode) && 
                          ce.getEnvironment() == environment);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public VersionType getVersionType() {
        return versionType;
    }

    public void setVersionType(VersionType versionType) {
        this.versionType = versionType;
    }

    public ReleaseStatus getStatus() {
        return status;
    }

    public void setStatus(ReleaseStatus status) {
        this.status = status;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getCommitHash() {
        return commitHash;
    }

    public void setCommitHash(String commitHash) {
        this.commitHash = commitHash;
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

    public String getPackageUrl() {
        return packageUrl;
    }

    public void setPackageUrl(String packageUrl) {
        this.packageUrl = packageUrl;
    }

    public List<ReleaseStatusHistory> getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(List<ReleaseStatusHistory> statusHistory) {
        this.statusHistory = statusHistory;
    }

    public List<ReleaseClientEnvironment> getClientEnvironments() {
        return clientEnvironments;
    }

    public void setClientEnvironments(List<ReleaseClientEnvironment> clientEnvironments) {
        this.clientEnvironments = clientEnvironments;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

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
                ", version='" + version + '\'' +
                ", status=" + status +
                '}';
    }
}