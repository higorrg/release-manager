package com.empresa.app.releasemanagement.adapter.in.dto;

import jakarta.validation.constraints.NotBlank;

public record AvailableVersionsRequest(
        @NotBlank(message = "Client code is required")
        String clientCode,
        
        @NotBlank(message = "Environment is required")
        String environment
) {
}