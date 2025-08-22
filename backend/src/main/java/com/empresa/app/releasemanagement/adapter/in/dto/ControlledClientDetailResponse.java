package com.empresa.app.releasemanagement.adapter.in.dto;

import com.empresa.app.clientmanagement.domain.model.Client;
import com.empresa.app.clientmanagement.domain.model.Environment;
import com.empresa.app.releasemanagement.domain.model.ReleaseClientEnvironment;
import java.time.LocalDateTime;
import java.util.UUID;

public record ControlledClientDetailResponse(
        UUID id,
        UUID releaseId,
        UUID clientId,
        String clientCode,
        String clientName,
        String clientDescription,
        UUID environmentId,
        String environmentName,
        String environmentDescription,
        LocalDateTime createdAt
) {
    public static ControlledClientDetailResponse from(
            ReleaseClientEnvironment rce, 
            Client client, 
            Environment environment) {
        return new ControlledClientDetailResponse(
                rce.getId(),
                rce.getReleaseId(),
                rce.getClientId(),
                client.getClientCode(),
                client.getName(),
                client.getDescription(),
                rce.getEnvironmentId(),
                environment.getName(),
                environment.getDescription(),
                rce.getCreatedAt()
        );
    }
}