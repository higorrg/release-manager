package br.com.releasemanager.release.application.service;

import br.com.releasemanager.business_exception.BusinessException;
import br.com.releasemanager.release.application.port.in.ChangeReleaseStatusUseCase;
import br.com.releasemanager.release.application.port.in.ChangeStatusCommand;
import br.com.releasemanager.release.application.port.out.ReleaseRepository;
import br.com.releasemanager.release.application.port.out.ReleaseStatusHistoryRepository;
import br.com.releasemanager.release.domain.model.Release;
import br.com.releasemanager.release.domain.model.ReleaseStatus;
import br.com.releasemanager.release.domain.model.ReleaseStatusHistory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Objects;

@ApplicationScoped
public class ChangeReleaseStatusService implements ChangeReleaseStatusUseCase {

    private final ReleaseRepository releaseRepository;
    private final ReleaseStatusHistoryRepository statusHistoryRepository;

    @Inject
    public ChangeReleaseStatusService(ReleaseRepository releaseRepository,
                                     ReleaseStatusHistoryRepository statusHistoryRepository) {
        this.releaseRepository = Objects.requireNonNull(releaseRepository);
        this.statusHistoryRepository = Objects.requireNonNull(statusHistoryRepository);
    }

    @Override
    @Transactional
    public Release changeStatus(ChangeStatusCommand command) {
        Objects.requireNonNull(command, "Command cannot be null");
        Objects.requireNonNull(command.releaseId(), "Release ID cannot be null");
        Objects.requireNonNull(command.newStatus(), "New status cannot be null");

        // Find the release
        Release release = releaseRepository.findById(command.releaseId())
            .orElseThrow(() -> new BusinessException(
                String.format("Release with ID %d not found", command.releaseId())
            ));

        // Get current status before change
        ReleaseStatus previousStatus = release.getCurrentStatus();

        // Validate status change (business rules can be added here)
        if (previousStatus == command.newStatus()) {
            throw new BusinessException(
                String.format("Release is already in status '%s'", command.newStatus().getDisplayName())
            );
        }

        // Change status in domain model
        release.changeStatus(command.newStatus());

        // Save updated release
        Release updatedRelease = releaseRepository.save(release);

        // Create status history entry for audit trail
        ReleaseStatusHistory statusHistory = new ReleaseStatusHistory(
            release.getId(),
            previousStatus,
            command.newStatus(),
            command.changedBy(),
            command.notes()
        );
        statusHistoryRepository.save(statusHistory);

        return updatedRelease;
    }
}
