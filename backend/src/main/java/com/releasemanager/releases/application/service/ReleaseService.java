package com.releasemanager.releases.application.service;

import com.releasemanager.audit.application.port.out.ReleaseStatusHistoryRepository;
import com.releasemanager.audit.domain.model.ReleaseStatusHistory;
import com.releasemanager.clients.application.port.out.ClientRepository;
import com.releasemanager.releases.application.port.in.*;
import com.releasemanager.releases.application.port.out.ProductRepository;
import com.releasemanager.releases.application.port.out.ReleaseClientEnvironmentRepository;
import com.releasemanager.releases.application.port.out.ReleaseRepository;
import com.releasemanager.releases.domain.model.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class ReleaseService implements CreateReleaseUseCase, UpdateReleaseStatusUseCase, 
                                      GetReleasesUseCase, ManageReleaseClientEnvironmentUseCase,
                                      GetAvailableReleasesForClientUseCase {

    @Inject
    ReleaseRepository releaseRepository;

    @Inject
    ProductRepository productRepository;

    @Inject
    ClientRepository clientRepository;

    @Inject
    ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository;

    @Inject
    ReleaseStatusHistoryRepository releaseStatusHistoryRepository;

    @Override
    @Transactional
    public CreateReleaseResult createRelease(CreateReleaseCommand command) {
        var product = productRepository.findByName(command.productName())
            .orElseGet(() -> {
                var newProduct = new Product(command.productName(), "Produto criado automaticamente");
                return productRepository.save(newProduct);
            });

        var existingRelease = releaseRepository.findByProductNameAndVersion(
            command.productName(), command.version());
        
        if (existingRelease.isPresent()) {
            var release = existingRelease.get();
            return new CreateReleaseResult(
                release.id, 
                product.name, 
                release.version, 
                release.status.getDisplayName()
            );
        }

        var release = new Release(product, command.version());
        release = releaseRepository.save(release);

        var history = new ReleaseStatusHistory(
            release, 
            null, 
            ReleaseStatus.MR_APROVADO, 
            "system", 
            "Release criada automaticamente via API"
        );
        releaseStatusHistoryRepository.save(history);

        return new CreateReleaseResult(
            release.id, 
            product.name, 
            release.version, 
            release.status.getDisplayName()
        );
    }

    @Override
    @Transactional
    public UpdateStatusResult updateStatus(UpdateStatusCommand command) {
        var release = releaseRepository.findByIdOptional(command.releaseId())
            .orElseThrow(() -> new IllegalArgumentException("Release não encontrada"));

        var previousStatus = release.status;
        release.updateStatus(command.newStatus());
        release = releaseRepository.save(release);

        var history = new ReleaseStatusHistory(
            release, 
            previousStatus, 
            command.newStatus(), 
            command.changedBy(), 
            command.observation()
        );
        releaseStatusHistoryRepository.save(history);

        return new UpdateStatusResult(
            release.id,
            release.version,
            previousStatus != null ? previousStatus.getDisplayName() : null,
            command.newStatus().getDisplayName(),
            command.changedBy()
        );
    }

    @Override
    public ReleasesResult getReleases(ReleaseQuery query) {
        var releases = releaseRepository.getAllReleases().stream()
            .filter(release -> {
                if (Objects.nonNull(query.productName()) && 
                    !release.product.name.contains(query.productName())) {
                    return false;
                }
                if (Objects.nonNull(query.version()) && 
                    !release.version.contains(query.version())) {
                    return false;
                }
                if (Objects.nonNull(query.status()) && 
                    !release.status.equals(query.status())) {
                    return false;
                }
                return true;
            })
            .map(this::mapToReleaseInfo)
            .toList();

        int page = query.page() != null ? query.page() : 0;
        int size = query.size() != null ? query.size() : 20;
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, releases.size());
        
        var paginatedReleases = releases.subList(startIndex, endIndex);
        int totalPages = (int) Math.ceil((double) releases.size() / size);

        return new ReleasesResult(paginatedReleases, releases.size(), totalPages, page);
    }

    @Override
    public ReleaseInfo getReleaseById(Long releaseId) {
        var release = releaseRepository.findByIdOptional(releaseId)
            .orElseThrow(() -> new IllegalArgumentException("Release não encontrada"));
        return mapToReleaseInfo(release);
    }

    @Override
    @Transactional
    public void addClientEnvironment(AddClientEnvironmentCommand command) {
        var release = releaseRepository.findByIdOptional(command.releaseId())
            .orElseThrow(() -> new IllegalArgumentException("Release não encontrada"));

        var client = clientRepository.findByCode(command.clientCode())
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        var existing = releaseClientEnvironmentRepository.findByReleaseIdAndClientCodeAndEnvironment(
            command.releaseId(), command.clientCode(), command.environment());
        
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Cliente e ambiente já associados a esta release");
        }

        var releaseClientEnv = new ReleaseClientEnvironment(release, client, command.environment());
        releaseClientEnvironmentRepository.save(releaseClientEnv);
    }

    @Override
    @Transactional
    public void removeClientEnvironment(RemoveClientEnvironmentCommand command) {
        var releaseClientEnv = releaseClientEnvironmentRepository
            .findByReleaseIdAndClientCodeAndEnvironment(
                command.releaseId(), command.clientCode(), command.environment())
            .orElseThrow(() -> new IllegalArgumentException("Associação não encontrada"));

        releaseClientEnvironmentRepository.delete(releaseClientEnv);
    }

    @Override
    public List<ClientEnvironmentInfo> getClientEnvironments(Long releaseId) {
        return releaseClientEnvironmentRepository.findByReleaseId(releaseId).stream()
            .map(rce -> new ClientEnvironmentInfo(
                rce.id,
                rce.client.code,
                rce.client.name,
                rce.environment.getValue()
            ))
            .toList();
    }

    @Override
    public List<AvailableReleaseInfo> getAvailableReleases(ClientReleaseQuery query) {
        var clientEnvironments = releaseClientEnvironmentRepository
            .findByClientCodeAndEnvironment(query.clientCode(), query.environment());

        return clientEnvironments.stream()
            .filter(rce -> rce.release.status == ReleaseStatus.DISPONIVEL || 
                          rce.release.status == ReleaseStatus.CONTROLADA)
            .map(rce -> new AvailableReleaseInfo(
                rce.release.version,
                rce.release.releaseNotes,
                rce.release.prerequisites,
                rce.release.downloadUrl
            ))
            .toList();
    }

    private ReleaseInfo mapToReleaseInfo(Release release) {
        return new ReleaseInfo(
            release.id,
            release.product.name,
            release.version,
            release.status.getDisplayName(),
            release.releaseNotes,
            release.prerequisites,
            release.downloadUrl,
            release.createdAt,
            release.updatedAt
        );
    }
}