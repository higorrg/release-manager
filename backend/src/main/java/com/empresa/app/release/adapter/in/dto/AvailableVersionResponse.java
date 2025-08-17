package com.empresa.app.release.adapter.in.dto;

import com.empresa.app.release.domain.model.Release;
import com.empresa.app.release.domain.model.Product;
import java.time.LocalDateTime;
import java.util.UUID;

public record AvailableVersionResponse(
        UUID releaseId,
        String productName,
        String version,
        String releaseNotes,
        String prerequisites,
        String downloadUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AvailableVersionResponse from(Release release, Product product) {
        return new AvailableVersionResponse(
                release.getId(),
                product != null ? product.getName() : "Unknown Product",
                release.getVersion(),
                release.getReleaseNotes(),
                release.getPrerequisites(),
                release.getDownloadUrl(),
                release.getCreatedAt(),
                release.getUpdatedAt()
        );
    }
}