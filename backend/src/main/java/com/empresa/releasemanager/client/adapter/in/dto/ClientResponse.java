package com.empresa.releasemanager.client.adapter.in.dto;

import com.empresa.releasemanager.client.domain.model.Client;

import java.time.LocalDateTime;

public record ClientResponse(
    Long id,
    String clientCode,
    String companyName,
    String contactEmail,
    String contactPhone,
    Boolean isActive,
    Boolean isBetaPartner,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static ClientResponse from(Client client) {
        return new ClientResponse(
            client.getId(),
            client.getClientCode(),
            client.getCompanyName(),
            client.getContactEmail(),
            client.getContactPhone(),
            client.getIsActive(),
            client.getIsBetaPartner(),
            client.getNotes(),
            client.getCreatedAt(),
            client.getUpdatedAt()
        );
    }
}