package com.empresa.app.release.adapter.in.dto;

import com.empresa.app.release.domain.model.ReleaseStatus;
import com.empresa.app.release.domain.model.ReleaseStatusHistory;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReleaseStatusHistoryResponse(
        UUID id,
        UUID releaseId,
        ReleaseStatus previousStatus,
        String previousStatusDisplayName,
        ReleaseStatus newStatus,
        String newStatusDisplayName,
        String changedBy,
        LocalDateTime changedAt,
        String comments
) {
    public static ReleaseStatusHistoryResponse from(ReleaseStatusHistory history) {
        return new ReleaseStatusHistoryResponse(
                history.getId(),
                history.getReleaseId(),
                history.getPreviousStatus(),
                history.getPreviousStatus() != null ? history.getPreviousStatus().getDisplayName() : null,
                history.getNewStatus(),
                history.getNewStatus().getDisplayName(),
                history.getChangedBy(),
                history.getChangedAt(),
                history.getComments()
        );
    }
}