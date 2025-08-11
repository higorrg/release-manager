package com.releasemanager.application.service;

import com.releasemanager.application.port.in.UpdateReleaseStatusUseCase;
import com.releasemanager.application.port.out.ReleaseRepository;
import com.releasemanager.application.port.out.ReleaseStatusLogRepository;
import com.releasemanager.domain.model.ReleaseId;
import com.releasemanager.domain.model.ReleaseStatus;
import com.releasemanager.domain.model.ReleaseStatusLog;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.Instant;
import java.util.Objects;

@ApplicationScoped
public class UpdateReleaseStatusService implements UpdateReleaseStatusUseCase {

    @Inject ReleaseRepository releaseRepository;
    @Inject ReleaseStatusLogRepository logRepository;

    @Override
    public void updateStatus(ReleaseId id, ReleaseStatus status) {
        if (Objects.isNull(id) || Objects.isNull(status)) {
            throw new IllegalArgumentException("id and status must be provided");
        }
        releaseRepository.updateStatus(id, status);
        logRepository.log(new ReleaseStatusLog(id, status, Instant.now()));
    }
}
