package br.com.releasemanager.release.adapter.out.persistence;

import br.com.releasemanager.release.domain.model.ReleaseStatus;
import br.com.releasemanager.release.domain.model.ReleaseStatusHistory;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "release_status_history")
public class ReleaseStatusHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "release_id", nullable = false)
    private Long releaseId;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status")
    private ReleaseStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private ReleaseStatus newStatus;

    @Column(name = "changed_by")
    private String changedBy;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public ReleaseStatusHistoryEntity() {}

    public ReleaseStatusHistoryEntity(ReleaseStatusHistory statusHistory) {
        this.id = statusHistory.getId();
        this.releaseId = statusHistory.getReleaseId();
        this.previousStatus = statusHistory.getPreviousStatus();
        this.newStatus = statusHistory.getNewStatus();
        this.changedBy = statusHistory.getChangedBy();
        this.changedAt = statusHistory.getChangedAt();
        this.notes = statusHistory.getNotes();
    }

    public ReleaseStatusHistory toDomain() {
        return new ReleaseStatusHistory(id, releaseId, previousStatus, newStatus, 
                                       changedBy, changedAt, notes);
    }

    @PrePersist
    protected void onCreate() {
        if (changedAt == null) {
            changedAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReleaseId() { return releaseId; }
    public void setReleaseId(Long releaseId) { this.releaseId = releaseId; }

    public ReleaseStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(ReleaseStatus previousStatus) { this.previousStatus = previousStatus; }

    public ReleaseStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ReleaseStatus newStatus) { this.newStatus = newStatus; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReleaseStatusHistoryEntity that = (ReleaseStatusHistoryEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}