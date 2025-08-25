package com.empresa.app.releases.application.service;

import com.empresa.app.releases.application.port.in.ListReleasesUseCase;
import com.empresa.app.releases.application.port.out.ReleaseRepository;
import com.empresa.app.releases.domain.model.ProductName;
import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.shared.domain.ReleaseStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class ListReleasesService implements ListReleasesUseCase {
    
    private final ReleaseRepository releaseRepository;
    
    @Inject
    public ListReleasesService(ReleaseRepository releaseRepository) {
        this.releaseRepository = Objects.requireNonNull(releaseRepository, "ReleaseRepository cannot be null");
    }
    
    @Override
    public List<Release> listAll() {
        return releaseRepository.findAll();
    }
    
    @Override
    public List<Release> listByProductName(ProductName productName) {
        Objects.requireNonNull(productName, "ProductName cannot be null");
        
        return releaseRepository.findByProductName(productName);
    }
    
    @Override
    public List<Release> listByStatus(ReleaseStatus status) {
        Objects.requireNonNull(status, "ReleaseStatus cannot be null");
        
        return releaseRepository.findByStatus(status);
    }
    
    @Override
    public List<Release> listByProductNameAndStatus(ProductName productName, ReleaseStatus status) {
        Objects.requireNonNull(productName, "ProductName cannot be null");
        Objects.requireNonNull(status, "ReleaseStatus cannot be null");
        
        return releaseRepository.findByProductNameAndStatus(productName, status);
    }
}