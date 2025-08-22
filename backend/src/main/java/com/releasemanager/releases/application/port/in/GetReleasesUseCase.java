package com.releasemanager.releases.application.port.in;

import com.releasemanager.releases.domain.model.ReleaseStatus;
import java.time.ZonedDateTime;
import java.util.List;

public interface GetReleasesUseCase {
    
    record ReleaseQuery(
        String productName,
        String version,
        ReleaseStatus status,
        Integer page,
        Integer size
    ) {}
    
    record ReleaseInfo(
        Long id,
        String productName,
        String version,
        String status,
        String releaseNotes,
        String prerequisites,
        String downloadUrl,
        ZonedDateTime createdAt,
        ZonedDateTime updatedAt
    ) {}
    
    record ReleasesResult(
        List<ReleaseInfo> releases,
        long totalElements,
        int totalPages,
        int currentPage
    ) {}
    
    ReleasesResult getReleases(ReleaseQuery query);
    ReleaseInfo getReleaseById(Long releaseId);
}