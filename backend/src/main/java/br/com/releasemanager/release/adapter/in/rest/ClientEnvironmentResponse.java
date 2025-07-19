package br.com.releasemanager.release.adapter.in.rest;

import br.com.releasemanager.release.domain.model.ReleaseClientEnvironment;

public record ClientEnvironmentResponse(
    Long id,
    Long releaseId,
    String clientCode,
    String environment
) {
    public static ClientEnvironmentResponse from(ReleaseClientEnvironment clientEnvironment) {
        return new ClientEnvironmentResponse(
            clientEnvironment.getId(),
            clientEnvironment.getReleaseId(),
            clientEnvironment.getClientCode(),
            clientEnvironment.getEnvironment().name()
        );
    }
}