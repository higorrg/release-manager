package com.empresa.releasemanager.release.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "release_status_history")
public class ReleaseStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "release_id", nullable = false)
    private Release release;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", nullable = false)
    private ReleaseStatus previousStatus;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private ReleaseStatus newStatus;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "changed_by", nullable = false)
    private String changedBy;

    @CreationTimestamp
    @Column(name = "changed_at", nullable = false, updatable = false)
    private LocalDateTime changedAt;

    // Constructors
    public ReleaseStatusHistory() {}

    public ReleaseStatusHistory(Release release, ReleaseStatus previousStatus, 
                              ReleaseStatus newStatus, String reason, String changedBy) {
        this.release = release;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.reason = reason;
        this.changedBy = changedBy;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Release getRelease() {
        return release;
    }

    public void setRelease(Release release) {
        this.release = release;
    }

    public ReleaseStatus getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(ReleaseStatus previousStatus) {
        this.previousStatus = previousStatus;
    }

    public ReleaseStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(ReleaseStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

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
                ", previousStatus=" + previousStatus +
                ", newStatus=" + newStatus +
                ", changedBy='" + changedBy + '\'' +
                ", changedAt=" + changedAt +
                '}';
    }
}