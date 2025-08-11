package com.releasemanager.application.service;

import com.releasemanager.application.port.in.RegisterReleaseUseCase;
import com.releasemanager.application.port.out.ReleaseRepository;
import com.releasemanager.application.port.out.ReleaseStatusLogRepository;
import com.releasemanager.domain.model.Release;
import com.releasemanager.domain.model.ReleaseClient;
import com.releasemanager.domain.model.ReleaseId;
import com.releasemanager.domain.model.ReleaseStatus;
import com.releasemanager.domain.model.ReleaseStatusLog;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.Instant;
import java.util.Collections;
import java.util.UUID;

@ApplicationScoped
public class RegisterReleaseService implements RegisterReleaseUseCase {

    @Inject ReleaseRepository releaseRepository;
    @Inject ReleaseStatusLogRepository logRepository;

    @Override
    public Release register(String productName, String version) {
        Release release = new Release(new ReleaseId(UUID.randomUUID()), productName, version, ReleaseStatus.MR_APROVADO, Collections.emptySet());
        Release persisted = releaseRepository.save(release);
        logRepository.log(new ReleaseStatusLog(persisted.id(), persisted.status(), Instant.now()));
        return persisted;
    }
}
