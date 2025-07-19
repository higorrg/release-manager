package br.com.releasemanager.release.application.service;

import br.com.releasemanager.business_exception.BusinessException;
import br.com.releasemanager.release.application.port.in.CreateReleaseCommand;
import br.com.releasemanager.release.application.port.in.CreateReleaseUseCase;
import br.com.releasemanager.release.application.port.out.ReleaseRepository;
import br.com.releasemanager.release.application.port.out.ReleaseStatusHistoryRepository;
import br.com.releasemanager.release.domain.model.Release;
import br.com.releasemanager.release.domain.model.ReleaseStatus;
import br.com.releasemanager.release.domain.model.ReleaseStatusHistory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.Objects;

@ApplicationScoped
public class CreateReleaseService implements CreateReleaseUseCase {

    private final ReleaseRepository releaseRepository;
    private final ReleaseStatusHistoryRepository statusHistoryRepository;

    @Inject
    public CreateReleaseService(ReleaseRepository releaseRepository,
                               ReleaseStatusHistoryRepository statusHistoryRepository) {
        this.releaseRepository = Objects.requireNonNull(releaseRepository);
        this.statusHistoryRepository = Objects.requireNonNull(statusHistoryRepository);
    }

    @Override
    public Release createRelease(CreateReleaseCommand command) {
        Objects.requireNonNull(command, "Command cannot be null");
        Objects.requireNonNull(command.productName(), "Product name cannot be null");
        Objects.requireNonNull(command.version(), "Version cannot be null");

        // Check if release already exists
        if (releaseRepository.existsByProductNameAndVersion(command.productName(), command.version())) {
            throw new BusinessException(
                String.format("Release already exists for product '%s' version '%s'", 
                    command.productName(), command.version().getFullVersion())
            );
        }

        // Create new release
        Release release = new Release(command.productName(), command.version());
        release.updateReleaseNotes(command.releaseNotes());
        release.updatePrerequisites(command.prerequisites());
        release.updateDownloadUrl(command.downloadUrl());

        // Save release
        Release savedRelease = releaseRepository.save(release);

        // Create initial status history entry
        ReleaseStatusHistory initialHistory = new ReleaseStatusHistory(
            savedRelease.getId(),
            null, // no previous status for initial creation
            ReleaseStatus.MR_APROVADO,
            "SYSTEM" // system-generated entry
        );
        statusHistoryRepository.save(initialHistory);

        return savedRelease;
    }
}
