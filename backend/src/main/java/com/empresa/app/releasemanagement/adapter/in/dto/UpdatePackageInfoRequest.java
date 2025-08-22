package com.empresa.app.releasemanagement.adapter.in.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdatePackageInfoRequest(
        String downloadUrl
) {}