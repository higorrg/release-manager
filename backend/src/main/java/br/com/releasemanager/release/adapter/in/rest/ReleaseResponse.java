package br.com.releasemanager.release.adapter.in.rest;

import br.com.releasemanager.release.domain.model.Release;

public record ReleaseResponse(
    Long id,
    String productName,
    String version,
    String currentStatus,
    String releaseNotes,
    String prerequisites,
    String downloadUrl
) {
    public static ReleaseResponse from(Release release) {
        return new ReleaseResponse(
            release.getId(),
            release.getProductName(),
            release.getVersion().getFullVersion(),
            release.getCurrentStatus().name(),
            release.getReleaseNotes(),
            release.getPrerequisites(),
            release.getDownloadUrl()
        );
    }
}