package com.empresa.app.releasemanagement.adapter.in.dto;

import com.empresa.app.releasemanagement.domain.model.ReleaseClientEnvironment;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReleaseClientEnvironmentResponse(
        UUID id,
        UUID releaseId,
        UUID clientId,
        UUID environmentId,
        LocalDateTime createdAt
) {
    public static ReleaseClientEnvironmentResponse from(ReleaseClientEnvironment rce) {
        return new ReleaseClientEnvironmentResponse(
                rce.getId(),
                rce.getReleaseId(),
                rce.getClientId(),
                rce.getEnvironmentId(),
                rce.getCreatedAt()
        );
    }
}