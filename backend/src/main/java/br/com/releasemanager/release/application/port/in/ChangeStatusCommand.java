package br.com.releasemanager.release.application.port.in;

import br.com.releasemanager.release.domain.model.ReleaseStatus;

public record ChangeStatusCommand(
    Long releaseId,
    ReleaseStatus newStatus,
    String changedBy,
    String notes
) {}