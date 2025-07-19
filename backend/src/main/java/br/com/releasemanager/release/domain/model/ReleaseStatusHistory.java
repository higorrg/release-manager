package br.com.releasemanager.release.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;

public class ReleaseStatusHistory {
    private Long id;
    private Long releaseId;
    private ReleaseStatus previousStatus;
    private ReleaseStatus newStatus;
    private String changedBy;
    private LocalDateTime changedAt;
    private String notes;

    public ReleaseStatusHistory() {
        this.changedAt = LocalDateTime.now();
    }

    public ReleaseStatusHistory(Long releaseId, ReleaseStatus previousStatus, 
                               ReleaseStatus newStatus, String changedBy) {
        this();
        this.releaseId = Objects.requireNonNull(releaseId, "Release ID cannot be null");
        this.previousStatus = previousStatus;
        this.newStatus = Objects.requireNonNull(newStatus, "New status cannot be null");
        this.changedBy = changedBy;
    }

    public ReleaseStatusHistory(Long releaseId, ReleaseStatus previousStatus, 
                               ReleaseStatus newStatus, String changedBy, String notes) {
        this(releaseId, previousStatus, newStatus, changedBy);
        this.notes = notes;
    }

    public ReleaseStatusHistory(Long id, Long releaseId, ReleaseStatus previousStatus,
                               ReleaseStatus newStatus, String changedBy, 
                               LocalDateTime changedAt, String notes) {
        this.id = id;
        this.releaseId = Objects.requireNonNull(releaseId, "Release ID cannot be null");
        this.previousStatus = previousStatus;
        this.newStatus = Objects.requireNonNull(newStatus, "New status cannot be null");
        this.changedBy = changedBy;
        this.changedAt = changedAt != null ? changedAt : LocalDateTime.now();
        this.notes = notes;
    }

    // Getters
    public Long getId() { return id; }
    public Long getReleaseId() { return releaseId; }
    public ReleaseStatus getPreviousStatus() { return previousStatus; }
    public ReleaseStatus getNewStatus() { return newStatus; }
    public String getChangedBy() { return changedBy; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public String getNotes() { return notes; }

    // Setters for persistence layer
    public void setId(Long id) { this.id = id; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReleaseStatusHistory that = (ReleaseStatusHistory) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(releaseId, that.releaseId) &&
               Objects.equals(changedAt, that.changedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, releaseId, changedAt);
    }

    @Override
    public String toString() {
        return "ReleaseStatusHistory{" +
               "id=" + id +
               ", releaseId=" + releaseId +
               ", previousStatus=" + previousStatus +
               ", newStatus=" + newStatus +
               ", changedBy='" + changedBy + '\'' +
               ", changedAt=" + changedAt +
               '}';
    }
}