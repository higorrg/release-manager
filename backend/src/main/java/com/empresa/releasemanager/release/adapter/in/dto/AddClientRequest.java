package com.empresa.releasemanager.release.adapter.in.dto;

import com.empresa.releasemanager.release.domain.model.Environment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddClientRequest(
    @NotBlank(message = "Client code is required")
    String clientCode,
    
    @NotNull(message = "Environment is required")
    Environment environment
) {}