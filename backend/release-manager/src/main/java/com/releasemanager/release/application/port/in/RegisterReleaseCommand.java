package com.releasemanager.release.application.port.in;

import jakarta.validation.constraints.NotBlank;

public record RegisterReleaseCommand(
    @NotBlank(message = "Product name cannot be blank")
    String productName,

    @NotBlank(message = "Version cannot be blank")
    String version,

    String type,
    String branch,
    String commitHash
) {
}
