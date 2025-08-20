package com.releasemanager.history.adapter.out.persistence;

import com.releasemanager.release.domain.model.ReleaseStatus;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "release_status_history")
public class ReleaseStatusHistoryJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private UUID releaseId;

    @Enumerated(EnumType.STRING)
    private ReleaseStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReleaseStatus newStatus;

    @Lob
    private String notes;

    private String changedByUser;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime changedAt;

    @PrePersist
    protected void onCreate() {
        changedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getReleaseId() { return releaseId; }
    public void setReleaseId(UUID releaseId) { this.releaseId = releaseId; }
    public ReleaseStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(ReleaseStatus previousStatus) { this.previousStatus = previousStatus; }
    public ReleaseStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ReleaseStatus newStatus) { this.newStatus = newStatus; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getChangedByUser() { return changedByUser; }
    public void setChangedByUser(String changedByUser) { this.changedByUser = changedByUser; }
    public OffsetDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(OffsetDateTime changedAt) { this.changedAt = changedAt; }
}
