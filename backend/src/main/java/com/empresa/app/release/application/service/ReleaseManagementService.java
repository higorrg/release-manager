package com.empresa.app.release.application.service;

import com.empresa.app.release.application.port.in.ReleaseManagementUseCase;
import com.empresa.app.release.application.port.out.ProductRepository;
import com.empresa.app.release.application.port.out.ReleaseRepository;
import com.empresa.app.release.application.port.out.ReleaseStatusHistoryRepository;
import com.empresa.app.release.domain.model.Product;
import com.empresa.app.release.domain.model.Release;
import com.empresa.app.release.domain.model.ReleaseStatus;
import com.empresa.app.release.domain.model.ReleaseStatusHistory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ReleaseManagementService implements ReleaseManagementUseCase {

    @Inject
    ReleaseRepository releaseRepository;
    
    @Inject
    ProductRepository productRepository;
    
    @Inject
    ReleaseStatusHistoryRepository statusHistoryRepository;

    @Override
    @Transactional
    public Release createReleaseFromPipeline(CreateReleaseCommand command) {
        if (Objects.isNull(command.productName()) || command.productName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be null or empty");
        }
        
        if (Objects.isNull(command.version()) || command.version().trim().isEmpty()) {
            throw new IllegalArgumentException("Version cannot be null or empty");
        }

        var product = productRepository.findByName(command.productName())
                .orElseGet(() -> createProduct(command.productName()));

        if (releaseRepository.existsByProductIdAndVersion(product.getId(), command.version())) {
            throw new IllegalStateException("Release already exists for product " + 
                    command.productName() + " and version " + command.version());
        }

        var release = Release.create(product.getId(), command.version());
        var savedRelease = releaseRepository.save(release);

        // Registrar histórico inicial
        var initialHistory = ReleaseStatusHistory.create(
                savedRelease.getId(),
                null,
                ReleaseStatus.MR_APROVADO,
                "PIPELINE"
        );
        statusHistoryRepository.save(initialHistory);

        return savedRelease;
    }

    @Override
    @Transactional
    public Release updateReleaseStatus(UpdateReleaseStatusCommand command) {
        if (Objects.isNull(command.releaseId())) {
            throw new IllegalArgumentException("Release ID cannot be null");
        }
        
        if (Objects.isNull(command.newStatus())) {
            throw new IllegalArgumentException("New status cannot be null");
        }

        var release = releaseRepository.findById(command.releaseId())
                .orElseThrow(() -> new IllegalArgumentException("Release not found"));

        var previousStatus = release.getStatus();
        release.updateStatus(command.newStatus());
        var updatedRelease = releaseRepository.save(release);

        // Registrar histórico de mudança
        var history = ReleaseStatusHistory.create(
                release.getId(),
                previousStatus,
                command.newStatus(),
                command.changedBy(),
                command.comments()
        );
        statusHistoryRepository.save(history);

        return updatedRelease;
    }

    @Override
    @Transactional
    public Release updateReleaseNotes(UpdateReleaseNotesCommand command) {
        if (Objects.isNull(command.releaseId())) {
            throw new IllegalArgumentException("Release ID cannot be null");
        }

        var release = releaseRepository.findById(command.releaseId())
                .orElseThrow(() -> new IllegalArgumentException("Release not found"));

        release.updateReleaseNotes(command.releaseNotes());
        return releaseRepository.save(release);
    }

    @Override
    @Transactional
    public Release updatePrerequisites(UpdatePrerequisitesCommand command) {
        if (Objects.isNull(command.releaseId())) {
            throw new IllegalArgumentException("Release ID cannot be null");
        }

        var release = releaseRepository.findById(command.releaseId())
                .orElseThrow(() -> new IllegalArgumentException("Release not found"));

        release.updatePrerequisites(command.prerequisites());
        return releaseRepository.save(release);
    }

    @Override
    public Optional<Release> findReleaseById(UUID releaseId) {
        if (Objects.isNull(releaseId)) {
            throw new IllegalArgumentException("Release ID cannot be null");
        }
        return releaseRepository.findById(releaseId);
    }

    @Override
    public List<Release> findReleasesByProduct(UUID productId) {
        if (Objects.isNull(productId)) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        return releaseRepository.findByProductId(productId);
    }

    @Override
    public List<ReleaseStatusHistory> findReleaseStatusHistory(UUID releaseId) {
        if (Objects.isNull(releaseId)) {
            throw new IllegalArgumentException("Release ID cannot be null");
        }
        return statusHistoryRepository.findByReleaseIdOrderByChangedAtDesc(releaseId);
    }

    private Product createProduct(String productName) {
        var product = Product.create(productName);
        return productRepository.save(product);
    }
}