package br.com.releasemanager.release.application.port.in;

import br.com.releasemanager.release.domain.model.Environment;

public record ListVersionsQuery(
    String clientCode,
    Environment environment,
    String productName
) {}