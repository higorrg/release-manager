package com.empresa.app.releasemanagement.adapter.in.dto;

import jakarta.validation.constraints.NotBlank;

public record AddControlledClientRequest(
        @NotBlank(message = "Client code is required") String clientCode,
        @NotBlank(message = "Environment is required") String environment
) {}