package com.releasemanager.releases.application.port.in;

import com.releasemanager.releases.domain.model.Environment;
import java.util.List;

public interface GetAvailableReleasesForClientUseCase {
    
    record ClientReleaseQuery(
        String clientCode,
        Environment environment
    ) {}
    
    record AvailableReleaseInfo(
        String version,
        String releaseNotes,
        String prerequisites,
        String downloadUrl
    ) {}
    
    List<AvailableReleaseInfo> getAvailableReleases(ClientReleaseQuery query);
}