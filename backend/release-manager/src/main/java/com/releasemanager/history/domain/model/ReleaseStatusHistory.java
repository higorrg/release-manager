package com.releasemanager.history.domain.model;

import com.releasemanager.release.domain.model.ReleaseStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public class ReleaseStatusHistory {

    private UUID id;
    private UUID releaseId;
    private ReleaseStatus previousStatus;
    private ReleaseStatus newStatus;
    private String notes;
    private String changedByUser;
    private OffsetDateTime changedAt;

    public ReleaseStatusHistory(UUID id, UUID releaseId, ReleaseStatus previousStatus, ReleaseStatus newStatus, String notes, String changedByUser) {
        this.id = id;
        this.releaseId = releaseId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.notes = notes;
        this.changedByUser = changedByUser;
        this.changedAt = OffsetDateTime.now();
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public UUID getReleaseId() {
        return releaseId;
    }

    public ReleaseStatus getPreviousStatus() {
        return previousStatus;
    }

    public ReleaseStatus getNewStatus() {
        return newStatus;
    }

    public String getNotes() {
        return notes;
    }

    public String getChangedByUser() {
        return changedByUser;
    }

    public OffsetDateTime getChangedAt() {
        return changedAt;
    }
}
