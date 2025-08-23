package com.empresa.releasemanager.release.adapter.in.dto;

import com.empresa.releasemanager.release.domain.model.ReleaseStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
    @NotNull(message = "New status is required")
    ReleaseStatus newStatus,
    
    String reason
) {}