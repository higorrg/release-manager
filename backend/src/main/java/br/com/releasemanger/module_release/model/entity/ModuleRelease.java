package br.com.releasemanger.module_release.model.entity;

import java.time.LocalDateTime;

import br.com.releasemanger.module.model.entity.Module;
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
 * Entity representing a module release.
 */
@Entity
@Table(name = "MODULE_RELEASE")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ModuleRelease extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @ManyToOne
    @JoinColumn(name = "RELEASE_STATUS_id", nullable = false)
    private ReleaseStatus releaseStatus;

    @Column(name = "artifact_location")
    private String artifactLocation;

    @Column(name = "version_created_timestamp")
    private LocalDateTime versionCreatedTimestamp;

    @Column(name = "major_version")
    private Integer majorVersion;

    @Column(name = "minor_version")
    private Integer minorVersion;

    @Column(name = "patch_version")
    private Integer patchVersion;

    @Column(name = "revision_version")
    private Integer revisionVersion;

    @Column(name = "release_notes")
    private String releaseNotes;

    @Column(name = "prerequisite")
    private String prerequisite;
}