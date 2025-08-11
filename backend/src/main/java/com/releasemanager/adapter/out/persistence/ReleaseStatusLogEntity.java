package com.releasemanager.adapter.out.persistence;

import com.releasemanager.domain.model.ReleaseStatus;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "release_status_logs")
public class ReleaseStatusLogEntity {

    @Id
    @GeneratedValue
    public UUID id;

    public UUID releaseId;

    @Enumerated(EnumType.STRING)
    public ReleaseStatus status;

    public Instant changedAt;
}
