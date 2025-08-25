package com.empresa.app.releases.domain.model;

import com.empresa.app.authentication.domain.model.UserId;
import com.empresa.app.shared.domain.ReleaseStatus;

import java.time.LocalDateTime;
import java.util.Objects;

public class ReleaseHistory {
    
    private final ReleaseHistoryId id;
    private final ReleaseId releaseId;
    private final UserId changedBy;
    private final ReleaseStatus previousStatus;
    private final ReleaseStatus newStatus;
    private final String observation;
    private final LocalDateTime timestamp;
    
    public ReleaseHistory(ReleaseHistoryId id, ReleaseId releaseId, UserId changedBy,
                         ReleaseStatus previousStatus, ReleaseStatus newStatus, 
                         String observation, LocalDateTime timestamp) {
        this.id = Objects.requireNonNull(id, "ReleaseHistoryId cannot be null");
        this.releaseId = Objects.requireNonNull(releaseId, "ReleaseId cannot be null");
        this.changedBy = Objects.requireNonNull(changedBy, "ChangedBy cannot be null");
        this.previousStatus = previousStatus; // Can be null for first status
        this.newStatus = Objects.requireNonNull(newStatus, "NewStatus cannot be null");
        this.observation = observation; // Can be null
        this.timestamp = Objects.requireNonNull(timestamp, "Timestamp cannot be null");
    }
    
    public static ReleaseHistory create(ReleaseId releaseId, UserId changedBy,
                                       ReleaseStatus previousStatus, ReleaseStatus newStatus,
                                       String observation) {
        return new ReleaseHistory(
            ReleaseHistoryId.generate(),
            releaseId,
            changedBy,
            previousStatus,
            newStatus,
            observation,
            LocalDateTime.now()
        );
    }
    
    public ReleaseHistoryId getId() {
        return id;
    }
    
    public ReleaseId getReleaseId() {
        return releaseId;
    }
    
    public UserId getChangedBy() {
        return changedBy;
    }
    
    public ReleaseStatus getPreviousStatus() {
        return previousStatus;
    }
    
    public ReleaseStatus getNewStatus() {
        return newStatus;
    }
    
    public String getObservation() {
        return observation;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReleaseHistory that)) return false;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}