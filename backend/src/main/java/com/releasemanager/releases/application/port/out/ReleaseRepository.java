package com.releasemanager.releases.application.port.out;

import com.releasemanager.releases.domain.model.Release;
import com.releasemanager.releases.domain.model.ReleaseStatus;
import java.util.List;
import java.util.Optional;

public interface ReleaseRepository {
    
    Release save(Release release);
    Optional<Release> findByIdOptional(Long id);
    Optional<Release> findByProductNameAndVersion(String productName, String version);
    List<Release> getAllReleases();
    List<Release> findByStatus(ReleaseStatus status);
    List<Release> findByProductName(String productName);
    List<Release> findWithPagination(int page, int size);
    long countAll();
    long countByStatus(ReleaseStatus status);
}