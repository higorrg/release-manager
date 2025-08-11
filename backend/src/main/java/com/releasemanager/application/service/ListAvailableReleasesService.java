package com.releasemanager.application.service;

import com.releasemanager.application.port.in.ListAvailableReleasesUseCase;
import com.releasemanager.application.port.out.ReleaseRepository;
import com.releasemanager.domain.model.Environment;
import com.releasemanager.domain.model.Release;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class ListAvailableReleasesService implements ListAvailableReleasesUseCase {

    @Inject ReleaseRepository releaseRepository;

    @Override
    public List<Release> listAvailable(String clientCode, Environment environment) {
        if (Objects.isNull(clientCode) || Objects.isNull(environment)) {
            throw new IllegalArgumentException("clientCode and environment must be provided");
        }
        return releaseRepository.findAvailableByClientAndEnvironment(clientCode, environment);
    }
}
