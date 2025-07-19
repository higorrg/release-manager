package br.com.releasemanager.release.application.port.in;

import br.com.releasemanager.release.domain.model.Release;
import br.com.releasemanager.release.domain.model.Version;

public record AvailableVersionResponse(
    Long releaseId,
    String productName,
    Version version,
    String releaseNotes,
    String prerequisites,
    String downloadUrl
) {
    public static AvailableVersionResponse from(Release release) {
        return new AvailableVersionResponse(
            release.getId(),
            release.getProductName(),
            release.getVersion(),
            release.getReleaseNotes(),
            release.getPrerequisites(),
            release.getDownloadUrl()
        );
    }
}