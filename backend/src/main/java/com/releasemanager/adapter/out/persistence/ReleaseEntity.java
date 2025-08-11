package com.releasemanager.adapter.out.persistence;

import com.releasemanager.domain.model.ReleaseStatus;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "releases")
public class ReleaseEntity {

    @Id
    public UUID id;

    public String productName;

    public String version;

    @Enumerated(EnumType.STRING)
    public ReleaseStatus status;

    @OneToMany(mappedBy = "release", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    public Set<ReleaseClientEntity> clients = new HashSet<>();
}
