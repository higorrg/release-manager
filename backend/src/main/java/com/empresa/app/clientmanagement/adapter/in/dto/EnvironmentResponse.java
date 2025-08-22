package com.empresa.app.clientmanagement.adapter.in.dto;

import com.empresa.app.clientmanagement.domain.model.Environment;
import java.time.LocalDateTime;
import java.util.UUID;

public record EnvironmentResponse(
        UUID id,
        String name,
        String description,
        LocalDateTime createdAt
) {
    public static EnvironmentResponse from(Environment environment) {
        return new EnvironmentResponse(
                environment.getId(),
                environment.getName(),
                environment.getDescription(),
                environment.getCreatedAt()
        );
    }
}