package com.releasemanager.adapter.out.persistence;

import com.releasemanager.domain.model.Environment;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "release_clients")
public class ReleaseClientEntity {

    @Id
    @GeneratedValue
    public UUID id;

    public String clientCode;

    @Enumerated(EnumType.STRING)
    public Environment environment;

    @ManyToOne
    @JoinColumn(name = "release_id")
    public ReleaseEntity release;
}
