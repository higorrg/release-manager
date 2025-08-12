package com.empresa.app.release.adapter.in;

import com.empresa.app.release.domain.model.Release;
import com.empresa.app.release.domain.model.ReleaseStatus;
import com.empresa.app.release.domain.model.ReleaseStatusHistory;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReleaseResponse(
        UUID id,
        UUID productId,
        String version,
        Integer majorVersion,
        Integer minorVersion,
        Integer patchVersion,
        ReleaseStatus status,
        String statusDisplayName,
        String releaseNotes,
        String prerequisites,
        String downloadUrl,
        String packagePath,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ReleaseResponse from(Release release) {
        return new ReleaseResponse(
                release.getId(),
                release.getProductId(),
                release.getVersion(),
                release.getMajorVersion(),
                release.getMinorVersion(),
                release.getPatchVersion(),
                release.getStatus(),
                release.getStatus().getDisplayName(),
                release.getReleaseNotes(),
                release.getPrerequisites(),
                release.getDownloadUrl(),
                release.getPackagePath(),
                release.getCreatedAt(),
                release.getUpdatedAt()
        );
    }
}

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