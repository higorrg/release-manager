package com.releasemanager.audit.domain.model;

import com.releasemanager.releases.domain.model.Release;
import com.releasemanager.releases.domain.model.ReleaseStatus;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.Objects;

@Entity
@Table(name = "release_status_history")
public class ReleaseStatusHistory extends PanacheEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "release_id", nullable = false)
    public Release release;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 50)
    public ReleaseStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 50)
    public ReleaseStatus newStatus;

    @Column(columnDefinition = "TEXT")
    public String observation;

    @Column(name = "changed_by", nullable = false)
    public String changedBy;

    @Column(name = "changed_at", nullable = false)
    public ZonedDateTime changedAt;

    public ReleaseStatusHistory() {
        this.changedAt = ZonedDateTime.now();
    }

    public ReleaseStatusHistory(Release release, ReleaseStatus previousStatus, 
                               ReleaseStatus newStatus, String changedBy, String observation) {
        this();
        this.release = release;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
        this.observation = observation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReleaseStatusHistory that = (ReleaseStatusHistory) o;
        return Objects.equals(release, that.release) && 
               Objects.equals(changedAt, that.changedAt) && 
               Objects.equals(changedBy, that.changedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(release, changedAt, changedBy);
    }

    @Override
    public String toString() {
        return "ReleaseStatusHistory{" +
                "id=" + id +
                ", release=" + (release != null ? release.version : null) +
                ", previousStatus=" + previousStatus +
                ", newStatus=" + newStatus +
                ", changedBy='" + changedBy + '\'' +
                ", changedAt=" + changedAt +
                '}';
    }
}