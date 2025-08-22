package com.empresa.app.releasemanagement.adapter.in.dto;

import com.empresa.app.releasemanagement.domain.model.ReleaseStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
        @NotNull(message = "Status is required") String newStatus,
        String changedBy,
        String comments
) {}