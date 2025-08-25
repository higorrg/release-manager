package com.empresa.app.releases.application.service;

import com.empresa.app.releases.application.port.in.UpdateReleaseStatusUseCase;
import com.empresa.app.releases.application.port.out.ReleaseHistoryRepository;
import com.empresa.app.releases.application.port.out.ReleaseRepository;
import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.releases.domain.model.ReleaseHistory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Objects;

@ApplicationScoped
public class UpdateReleaseStatusService implements UpdateReleaseStatusUseCase {
    
    private final ReleaseRepository releaseRepository;
    private final ReleaseHistoryRepository releaseHistoryRepository;
    
    @Inject
    public UpdateReleaseStatusService(ReleaseRepository releaseRepository,
                                     ReleaseHistoryRepository releaseHistoryRepository) {
        this.releaseRepository = Objects.requireNonNull(releaseRepository, "ReleaseRepository cannot be null");
        this.releaseHistoryRepository = Objects.requireNonNull(releaseHistoryRepository, "ReleaseHistoryRepository cannot be null");
    }
    
    @Override
    @Transactional
    public Release updateStatus(UpdateStatusCommand command) {
        Objects.requireNonNull(command, "UpdateStatusCommand cannot be null");
        
        var release = releaseRepository.findById(command.releaseId())
            .orElseThrow(() -> new IllegalArgumentException("Release not found"));
        
        var previousStatus = release.getStatus();
        
        // Cria o histórico da mudança antes de alterar o status
        var history = ReleaseHistory.create(
            command.releaseId(),
            command.updatedBy(),
            previousStatus,
            command.newStatus(),
            command.observation()
        );
        
        releaseHistoryRepository.save(history);
        
        // Atualiza o status da release
        release.updateStatus(command.newStatus(), command.updatedBy());
        
        return releaseRepository.save(release);
    }
}