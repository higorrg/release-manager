package com.releasemanager.releases.application.port.in;

import com.releasemanager.releases.domain.model.ReleaseStatus;

public interface UpdateReleaseStatusUseCase {
    
    record UpdateStatusCommand(
        Long releaseId,
        ReleaseStatus newStatus,
        String observation,
        String changedBy
    ) {}
    
    record UpdateStatusResult(
        Long releaseId,
        String version,
        String previousStatus,
        String newStatus,
        String changedBy
    ) {}
    
    UpdateStatusResult updateStatus(UpdateStatusCommand command);
}