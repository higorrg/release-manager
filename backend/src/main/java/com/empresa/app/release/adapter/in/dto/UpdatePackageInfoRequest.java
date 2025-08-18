package com.empresa.app.release.adapter.in.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdatePackageInfoRequest(
        String downloadUrl
) {}