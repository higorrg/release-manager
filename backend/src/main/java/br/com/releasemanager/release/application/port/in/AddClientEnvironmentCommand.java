package br.com.releasemanager.release.application.port.in;

import br.com.releasemanager.release.domain.model.Environment;

public record AddClientEnvironmentCommand(
    Long releaseId,
    String clientCode,
    Environment environment
) {}