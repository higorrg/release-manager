package com.empresa.releasemanager.release.adapter.in.dto;

import com.empresa.releasemanager.release.domain.model.VersionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateReleaseRequest(
    @NotBlank(message = "Product name is required")
    String productName,
    
    @NotBlank(message = "Version is required")
    String version,
    
    @NotNull(message = "Version type is required")
    VersionType versionType,
    
    String branchName,
    String commitHash
) {}