package br.com.releasemanger.status_change_log.model.entity;

import java.time.LocalDateTime;

import br.com.releasemanger.module_release.model.entity.ModuleRelease;
import br.com.releasemanger.release_status.model.entity.ReleaseStatus;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Entity representing a log of status changes for a module release.
 * This entity is used to track the history of status changes for a release.
 */
@Entity
@Table(name = "STATUS_CHANGE_LOG")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class StatusChangeLog extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "module_release_id", nullable = false)
    private ModuleRelease moduleRelease;

    @ManyToOne
    @JoinColumn(name = "release_status_id", nullable = false)
    private ReleaseStatus releaseStatus;

    @Column(name = "change_timestamp", nullable = false)
    private LocalDateTime changeTimestamp;

    @Column(name = "changed_by", length = 100)
    private String changedBy;

    @Column(name = "comments")
    private String comments;
}