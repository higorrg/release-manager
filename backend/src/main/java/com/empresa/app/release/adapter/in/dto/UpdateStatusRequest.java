package com.empresa.app.release.adapter.in.dto;

import com.empresa.app.release.domain.model.ReleaseStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
        @NotNull(message = "Status is required") ReleaseStatus status,
        String comments
) {}