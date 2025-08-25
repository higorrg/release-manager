package com.empresa.app.releases.application.service;

import com.empresa.app.releases.application.port.in.GetReleaseUseCase;
import com.empresa.app.releases.application.port.out.ReleaseRepository;
import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.releases.domain.model.ReleaseId;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.Objects;
import java.util.Optional;

@ApplicationScoped
public class GetReleaseService implements GetReleaseUseCase {
    
    private final ReleaseRepository releaseRepository;
    
    @Inject
    public GetReleaseService(ReleaseRepository releaseRepository) {
        this.releaseRepository = Objects.requireNonNull(releaseRepository, "ReleaseRepository cannot be null");
    }
    
    @Override
    public Optional<Release> getById(ReleaseId releaseId) {
        Objects.requireNonNull(releaseId, "ReleaseId cannot be null");
        
        return releaseRepository.findById(releaseId);
    }
}