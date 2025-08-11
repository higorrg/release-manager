package com.releasemanager.application.service;

import com.releasemanager.application.port.in.AddClientToReleaseUseCase;
import com.releasemanager.application.port.out.ReleaseRepository;
import com.releasemanager.domain.model.ReleaseClient;
import com.releasemanager.domain.model.ReleaseId;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.Objects;

@ApplicationScoped
public class AddClientToReleaseService implements AddClientToReleaseUseCase {

    @Inject ReleaseRepository releaseRepository;

    @Override
    public void addClient(ReleaseId id, ReleaseClient client) {
        if (Objects.isNull(id) || Objects.isNull(client)) {
            throw new IllegalArgumentException("id and client must be provided");
        }
        releaseRepository.addClient(id, client);
    }
}
