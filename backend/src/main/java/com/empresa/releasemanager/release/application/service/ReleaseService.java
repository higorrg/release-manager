package com.empresa.releasemanager.release.application.service;

import com.empresa.releasemanager.release.application.port.in.ReleaseUseCase;
import com.empresa.releasemanager.release.application.port.out.ReleaseRepository;
import com.empresa.releasemanager.release.domain.model.Environment;
import com.empresa.releasemanager.release.domain.model.Release;
import com.empresa.releasemanager.release.domain.model.ReleaseStatus;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
@Transactional
public class ReleaseService implements ReleaseUseCase {

    @Inject
    ReleaseRepository releaseRepository;

    @Override
    public Release createRelease(CreateReleaseCommand command) {
        // Check if release already exists
        if (releaseRepository.existsByProductNameAndVersion(command.productName(), command.version())) {
            // If exists, just return the existing one (idempotent operation for pipeline)
            return releaseRepository.findByProductNameAndVersion(command.productName(), command.version())
                .orElseThrow();
        }

        Release release = new Release(command.productName(), command.version(), command.versionType());
        release.setBranchName(command.branchName());
        release.setCommitHash(command.commitHash());
        release.setCreatedBy(command.createdBy());

        return releaseRepository.save(release);
    }

    private Release findReleaseById(Long id) {
        return releaseRepository.findAllReleases().stream()
            .filter(r -> r.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new ReleaseNotFoundException("Release not found: " + id));
    }

    @Override
    public void updateReleaseStatus(UpdateStatusCommand command) {
        Release release = findReleaseById(command.releaseId());
        release.updateStatus(command.newStatus(), command.reason(), command.updatedBy());
        releaseRepository.save(release);
    }

    @Override
    public void addClientToRelease(AddClientCommand command) {
        Release release = findReleaseById(command.releaseId());
        try {
            release.addClientEnvironment(command.clientCode(), command.environment());
            releaseRepository.save(release);
        } catch (IllegalArgumentException e) {
            throw new DuplicateClientEnvironmentException(e.getMessage());
        }
    }

    @Override
    public void removeClientFromRelease(RemoveClientCommand command) {
        Release release = findReleaseById(command.releaseId());
        release.removeClientEnvironment(command.clientCode(), command.environment());
        releaseRepository.save(release);
    }

    @Override
    public Optional<Release> findReleaseByProductAndVersion(String productName, String version) {
        return releaseRepository.findByProductNameAndVersion(productName, version);
    }

    @Override
    public List<Release> findAllReleases() {
        return releaseRepository.findAllReleases();
    }

    @Override
    public List<Release> findReleasesByStatus(ReleaseStatus status) {
        return releaseRepository.findByStatus(status);
    }

    @Override
    public List<Release> findAvailableReleasesForClient(String clientCode, Environment environment) {
        return releaseRepository.findAvailableForClient(clientCode, environment);
    }

    @Override
    public List<Release> findReleasesByProduct(String productName) {
        return releaseRepository.findByProductName(productName);
    }

    public static class ReleaseNotFoundException extends RuntimeException {
        public ReleaseNotFoundException(String message) {
            super(message);
        }
    }

    public static class DuplicateClientEnvironmentException extends RuntimeException {
        public DuplicateClientEnvironmentException(String message) {
            super(message);
        }
    }
}