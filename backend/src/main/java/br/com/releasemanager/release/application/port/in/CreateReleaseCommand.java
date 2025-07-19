package br.com.releasemanager.release.application.port.in;

import br.com.releasemanager.release.domain.model.Version;

public record CreateReleaseCommand(
    String productName,
    Version version,
    String releaseNotes,
    String prerequisites,
    String downloadUrl
) {}