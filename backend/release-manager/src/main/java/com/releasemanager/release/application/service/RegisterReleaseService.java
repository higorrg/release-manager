package com.releasemanager.release.application.service;

import com.releasemanager.history.application.port.out.ReleaseStatusHistoryRepository;
import com.releasemanager.history.domain.model.ReleaseStatusHistory;
import com.releasemanager.release.application.port.in.RegisterReleaseCommand;
import com.releasemanager.release.application.port.in.RegisterReleaseUseCase;
import com.releasemanager.release.application.port.out.ReleaseRepository;
import com.releasemanager.release.domain.model.Release;
import com.releasemanager.release.domain.model.ReleaseStatus;
import com.releasemanager.release.domain.model.ReleaseType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class RegisterReleaseService implements RegisterReleaseUseCase {

    private final ReleaseRepository releaseRepository;
    private final ReleaseStatusHistoryRepository historyRepository;

    @Inject
    public RegisterReleaseService(ReleaseRepository releaseRepository, ReleaseStatusHistoryRepository historyRepository) {
        this.releaseRepository = releaseRepository;
        this.historyRepository = historyRepository;
    }

    @Override
    @Transactional
    public Release register(RegisterReleaseCommand command) {
        Objects.requireNonNull(command, "RegisterReleaseCommand cannot be null");

        Optional<Release> existingReleaseOpt = releaseRepository
            .findByProductNameAndVersion(command.productName(), command.version());

        if (existingReleaseOpt.isPresent()) {
            return updateExistingRelease(existingReleaseOpt.get(), command);
        } else {
            return createNewRelease(command);
        }
    }

    private Release createNewRelease(RegisterReleaseCommand command) {
        Release newRelease = new Release(
            UUID.randomUUID(),
            command.productName(),
            command.version(),
            ReleaseStatus.MR_APROVADO
        );
        updateReleaseDetails(newRelease, command);

        Release savedRelease = releaseRepository.save(newRelease);
        createInitialHistoryRecord(savedRelease, "system-pipeline");

        return savedRelease;
    }

    private Release updateExistingRelease(Release existingRelease, RegisterReleaseCommand command) {
        updateReleaseDetails(existingRelease, command);
        return releaseRepository.save(existingRelease);
    }

    private void updateReleaseDetails(Release release, RegisterReleaseCommand command) {
        if (Objects.nonNull(command.type())) {
            try {
                release.setType(ReleaseType.valueOf(command.type().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Ignore if type is invalid, or handle as an error
            }
        }
        release.setBranch(command.branch());
        release.setCommitHash(command.commitHash());
    }

    private void createInitialHistoryRecord(Release release, String user) {
        ReleaseStatusHistory history = new ReleaseStatusHistory(
            UUID.randomUUID(),
            release.getId(),
            null, // No previous status
            release.getCurrentStatus(),
            "Release registered automatically by pipeline.",
            user
        );
        historyRepository.save(history);
    }
}
