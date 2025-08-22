package com.empresa.app.releasemanagement.adapter.out;

import com.empresa.app.releasemanagement.domain.model.ReleaseStatus;
import com.empresa.app.releasemanagement.domain.model.ReleaseStatusHistory;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "release_status_history")
public class ReleaseStatusHistoryEntity extends PanacheEntityBase {

    @Id
    @Column(name = "id")
    public UUID id;

    @Column(name = "release_id", nullable = false)
    public UUID releaseId;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 50)
    public ReleaseStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 50)
    public ReleaseStatus newStatus;

    @Column(name = "changed_by", length = 255)
    public String changedBy;

    @CreationTimestamp
    @Column(name = "changed_at", nullable = false, updatable = false)
    public LocalDateTime changedAt;

    @Column(name = "comments", columnDefinition = "TEXT")
    public String comments;

    public ReleaseStatusHistoryEntity() {}

    public static ReleaseStatusHistoryEntity from(ReleaseStatusHistory history) {
        var entity = new ReleaseStatusHistoryEntity();
        entity.id = history.getId();
        entity.releaseId = history.getReleaseId();
        entity.previousStatus = history.getPreviousStatus();
        entity.newStatus = history.getNewStatus();
        entity.changedBy = history.getChangedBy();
        entity.changedAt = history.getChangedAt();
        entity.comments = history.getComments();
        return entity;
    }

    public ReleaseStatusHistory toDomain() {
        var history = new ReleaseStatusHistory();
        history.setId(this.id);
        history.setReleaseId(this.releaseId);
        history.setPreviousStatus(this.previousStatus);
        history.setNewStatus(this.newStatus);
        history.setChangedBy(this.changedBy);
        history.setChangedAt(this.changedAt);
        history.setComments(this.comments);
        return history;
    }
}