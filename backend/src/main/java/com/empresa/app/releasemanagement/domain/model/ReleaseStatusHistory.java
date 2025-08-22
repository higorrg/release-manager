package com.empresa.app.releasemanagement.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class ReleaseStatusHistory {
    private UUID id;
    private UUID releaseId;
    private ReleaseStatus previousStatus;
    private ReleaseStatus newStatus;
    private String changedBy;
    private LocalDateTime changedAt;
    private String comments;

    public ReleaseStatusHistory() {}

    public ReleaseStatusHistory(UUID releaseId, ReleaseStatus previousStatus, 
                               ReleaseStatus newStatus, String changedBy) {
        this.id = UUID.randomUUID();
        this.releaseId = Objects.requireNonNull(releaseId, "Release ID cannot be null");
        this.previousStatus = previousStatus;
        this.newStatus = Objects.requireNonNull(newStatus, "New status cannot be null");
        this.changedBy = changedBy;
        this.changedAt = LocalDateTime.now();
    }

    public static ReleaseStatusHistory create(UUID releaseId, ReleaseStatus previousStatus, 
                                            ReleaseStatus newStatus, String changedBy) {
        return new ReleaseStatusHistory(releaseId, previousStatus, newStatus, changedBy);
    }

    public static ReleaseStatusHistory create(UUID releaseId, ReleaseStatus previousStatus, 
                                            ReleaseStatus newStatus, String changedBy, String comments) {
        var history = new ReleaseStatusHistory(releaseId, previousStatus, newStatus, changedBy);
        history.comments = comments;
        return history;
    }

    public void addComments(String comments) {
        this.comments = comments;
    }

    public boolean hasComments() {
        return Objects.nonNull(comments) && !comments.trim().isEmpty();
    }

    public boolean isStatusChange() {
        return !Objects.equals(previousStatus, newStatus);
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getReleaseId() { return releaseId; }
    public ReleaseStatus getPreviousStatus() { return previousStatus; }
    public ReleaseStatus getNewStatus() { return newStatus; }
    public String getChangedBy() { return changedBy; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public String getComments() { return comments; }

    // Setters for JPA
    public void setId(UUID id) { this.id = id; }
    public void setReleaseId(UUID releaseId) { this.releaseId = releaseId; }
    public void setPreviousStatus(ReleaseStatus previousStatus) { this.previousStatus = previousStatus; }
    public void setNewStatus(ReleaseStatus newStatus) { this.newStatus = newStatus; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
    public void setComments(String comments) { this.comments = comments; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReleaseStatusHistory that = (ReleaseStatusHistory) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
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