package com.empresa.app.releases.application.port.in;

import com.empresa.app.authentication.domain.model.UserId;
import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.releases.domain.model.ReleaseId;
import com.empresa.app.shared.domain.ReleaseStatus;

public interface UpdateReleaseStatusUseCase {
    
    Release updateStatus(UpdateStatusCommand command);
    
    record UpdateStatusCommand(
        ReleaseId releaseId,
        ReleaseStatus newStatus,
        UserId updatedBy,
        String observation
    ) {}
}