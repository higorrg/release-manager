package com.empresa.app.clientmanagement.adapter.in.dto;

import com.empresa.app.clientmanagement.domain.model.Client;
import java.time.LocalDateTime;
import java.util.UUID;

public record ClientResponse(
        UUID id,
        String clientCode,
        String name,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ClientResponse from(Client client) {
        return new ClientResponse(
                client.getId(),
                client.getClientCode(),
                client.getName(),
                client.getDescription(),
                client.getCreatedAt(),
                client.getUpdatedAt()
        );
    }
}