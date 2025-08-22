package com.releasemanager.releases.application.port.in;

import com.releasemanager.releases.domain.model.Release;

public interface CreateReleaseUseCase {
    
    record CreateReleaseCommand(
        String productName,
        String version
    ) {}
    
    record CreateReleaseResult(
        Long releaseId,
        String productName,
        String version,
        String status
    ) {}
    
    CreateReleaseResult createRelease(CreateReleaseCommand command);
}