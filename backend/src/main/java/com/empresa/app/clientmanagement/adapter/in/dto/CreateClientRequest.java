package com.empresa.app.clientmanagement.adapter.in.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateClientRequest(
        @NotBlank(message = "Client code is required")
        @Size(max = 50, message = "Client code must be less than 50 characters")
        String clientCode,
        
        @NotBlank(message = "Client name is required")
        @Size(max = 255, message = "Client name must be less than 255 characters")
        String name,
        
        @Size(max = 500, message = "Description must be less than 500 characters")
        String description
) {}