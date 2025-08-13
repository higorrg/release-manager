package com.empresa.app.release.adapter.in.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateReleaseRequest(
        @NotBlank(message = "Product name is required") String productName,
        @NotBlank(message = "Version is required") String version
) {}