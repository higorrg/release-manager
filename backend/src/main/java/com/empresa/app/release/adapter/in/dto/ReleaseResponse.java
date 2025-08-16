package com.empresa.app.release.adapter.in.dto;

import com.empresa.app.release.domain.model.Product;
import com.empresa.app.release.domain.model.Release;
import com.empresa.app.release.domain.model.ReleaseStatus;
import com.empresa.app.release.domain.model.ReleaseStatusHistory;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReleaseResponse(
        UUID id,
        UUID productId,
        String product,
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
    public static ReleaseResponse from(Release release, Product product) {
        return new ReleaseResponse(
                release.getId(),
                release.getProductId(),
                product != null ? product.getName() : "Unknown Product",
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

    public static ReleaseResponse from(Release release) {
        return from(release, null);
    }
}