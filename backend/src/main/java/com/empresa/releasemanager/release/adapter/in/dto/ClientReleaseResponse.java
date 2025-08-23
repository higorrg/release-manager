package com.empresa.releasemanager.release.adapter.in.dto;

import com.empresa.releasemanager.release.domain.model.Release;
import com.empresa.releasemanager.release.domain.model.VersionType;

public record ClientReleaseResponse(
    String productName,
    String version,
    VersionType versionType,
    String releaseNotes,
    String prerequisites,
    String packageUrl
) {
    public static ClientReleaseResponse from(Release release) {
        return new ClientReleaseResponse(
            release.getProductName(),
            release.getVersion(),
            release.getVersionType(),
            release.getReleaseNotes(),
            release.getPrerequisites(),
            release.getPackageUrl()
        );
    }
}