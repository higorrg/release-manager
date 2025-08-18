package com.empresa.app.release.application.service;

import com.empresa.app.release.application.port.in.ReleaseUseCase;
import com.empresa.app.release.application.port.in.ClientManagementUseCase;
import com.empresa.app.release.application.port.in.ReleaseClientAssociationUseCase;
import com.empresa.app.release.application.port.out.ClientRepository;
import com.empresa.app.release.application.port.out.EnvironmentRepository;
import com.empresa.app.release.application.port.out.ProductRepository;
import com.empresa.app.release.application.port.out.ReleaseClientEnvironmentRepository;
import com.empresa.app.release.application.port.out.ReleaseRepository;
import com.empresa.app.release.application.port.out.ReleaseStatusHistoryRepository;
import com.empresa.app.release.domain.model.Client;
import com.empresa.app.release.domain.model.Environment;
import com.empresa.app.release.domain.model.Product;
import com.empresa.app.release.domain.model.Release;
import com.empresa.app.release.domain.model.ReleaseClientEnvironment;
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
public class ReleaseManagementService implements ReleaseUseCase, ClientManagementUseCase, ReleaseClientAssociationUseCase {

    @Inject
    ReleaseRepository releaseRepository;
    
    @Inject
    ProductRepository productRepository;
    
    @Inject
    ReleaseStatusHistoryRepository statusHistoryRepository;
    
    @Inject
    ClientRepository clientRepository;
    
    @Inject
    EnvironmentRepository environmentRepository;
    
    @Inject
    ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository;

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
        System.out.println("✅ Status history created for new release: " + savedRelease.getId());

        return savedRelease;
    }

    @Override
    @Transactional
    public Release createReleaseFromWeb(CreateReleaseCommand command) {
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

        // Para releases criadas via web, inicia com status "Interno" em vez de "MR Aprovado"
        var release = Release.create(product.getId(), command.version());
        release.updateStatus(ReleaseStatus.INTERNO);
        var savedRelease = releaseRepository.save(release);

        // Registrar histórico inicial com status "Interno"
        var initialHistory = ReleaseStatusHistory.create(
                savedRelease.getId(),
                null,
                ReleaseStatus.INTERNO,
                "WEB_INTERFACE"
        );
        statusHistoryRepository.save(initialHistory);
        System.out.println("✅ Status history created for new web release: " + savedRelease.getId());

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
        System.out.println("✅ Status history updated: " + previousStatus + " → " + command.newStatus() + " by " + command.changedBy());

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
    @Transactional
    public Release updatePackageInfo(UpdatePackageInfoCommand command) {
        if (Objects.isNull(command.releaseId())) {
            throw new IllegalArgumentException("Release ID cannot be null");
        }

        var release = releaseRepository.findById(command.releaseId())
                .orElseThrow(() -> new IllegalArgumentException("Release not found"));

        if (command.downloadUrl() != null) {
            release.updateDownloadUrl(command.downloadUrl());
        }
        
        if (command.packagePath() != null) {
            release.updatePackagePath(command.packagePath());
        }
        
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
    public List<Release> findAllReleases() {
        return releaseRepository.findAll();
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

    @Override
    @Transactional
    public ReleaseClientEnvironment addControlledClient(AddControlledClientCommand command) {
        if (Objects.isNull(command.releaseId()) || Objects.isNull(command.clientCode()) || Objects.isNull(command.environmentName())) {
            throw new IllegalArgumentException("Release ID, client code and environment name cannot be null");
        }

        // Verify release exists
        var release = releaseRepository.findById(command.releaseId())
                .orElseThrow(() -> new IllegalArgumentException("Release not found"));

        // Find or create client
        var client = findOrCreateClient(command.clientCode());

        // Find environment
        var environment = environmentRepository.findByName(command.environmentName().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Environment not found: " + command.environmentName()));

        // Check if association already exists
        var existing = releaseClientEnvironmentRepository.findByReleaseIdAndClientIdAndEnvironmentId(
                command.releaseId(), client.getId(), environment.getId());
        
        if (existing.isPresent()) {
            throw new IllegalStateException("Client already associated to this release in this environment");
        }

        // Create association
        var association = ReleaseClientEnvironment.create(command.releaseId(), client.getId(), environment.getId());
        return releaseClientEnvironmentRepository.save(association);
    }

    @Override
    @Transactional
    public void removeControlledClient(UUID releaseId, UUID clientId, UUID environmentId) {
        if (Objects.isNull(releaseId) || Objects.isNull(clientId) || Objects.isNull(environmentId)) {
            throw new IllegalArgumentException("Release ID, client ID and environment ID cannot be null");
        }

        var association = releaseClientEnvironmentRepository.findByReleaseIdAndClientIdAndEnvironmentId(
                releaseId, clientId, environmentId)
                .orElseThrow(() -> new IllegalArgumentException("Association not found"));

        releaseClientEnvironmentRepository.deleteById(association.getId());
    }

    @Override
    public List<ReleaseClientEnvironment> findControlledClients(UUID releaseId) {
        if (Objects.isNull(releaseId)) {
            throw new IllegalArgumentException("Release ID cannot be null");
        }
        return releaseClientEnvironmentRepository.findByReleaseId(releaseId);
    }

    @Override
    public List<Client> findAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public List<Environment> findAllEnvironments() {
        return environmentRepository.findAll();
    }

    @Override
    @Transactional
    public Client findOrCreateClient(String clientCode) {
        if (Objects.isNull(clientCode) || clientCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Client code cannot be null or empty");
        }

        return clientRepository.findByClientCode(clientCode)
                .orElseGet(() -> {
                    var newClient = Client.create(clientCode, "Cliente " + clientCode);
                    return clientRepository.save(newClient);
                });
    }

    @Override
    public Optional<Client> findClientById(UUID clientId) {
        if (Objects.isNull(clientId)) {
            throw new IllegalArgumentException("Client ID cannot be null");
        }
        return clientRepository.findById(clientId);
    }

    @Override
    @Transactional
    public Client createClient(CreateClientCommand command) {
        if (Objects.isNull(command.clientCode()) || command.clientCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Client code cannot be null or empty");
        }
        
        if (Objects.isNull(command.name()) || command.name().trim().isEmpty()) {
            throw new IllegalArgumentException("Client name cannot be null or empty");
        }

        // Check if client code already exists
        if (clientRepository.findByClientCode(command.clientCode()).isPresent()) {
            throw new IllegalStateException("Client with code '" + command.clientCode() + "' already exists");
        }

        var client = Client.create(command.clientCode(), command.name(), command.description());
        return clientRepository.save(client);
    }

    @Override
    @Transactional
    public Client updateClient(UpdateClientCommand command) {
        if (Objects.isNull(command.clientId())) {
            throw new IllegalArgumentException("Client ID cannot be null");
        }
        
        if (Objects.isNull(command.name()) || command.name().trim().isEmpty()) {
            throw new IllegalArgumentException("Client name cannot be null or empty");
        }

        var client = clientRepository.findById(command.clientId())
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        client.updateName(command.name());
        client.updateDescription(command.description());
        return clientRepository.save(client);
    }

    @Override
    @Transactional
    public void deleteClient(UUID clientId) {
        if (Objects.isNull(clientId)) {
            throw new IllegalArgumentException("Client ID cannot be null");
        }

        var client = clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        // Check if client is being used in any releases
        var controlledReleases = releaseClientEnvironmentRepository.findByClientId(clientId);
        if (!controlledReleases.isEmpty()) {
            throw new IllegalStateException("Cannot delete client: it is being used in " + controlledReleases.size() + " controlled releases");
        }

        clientRepository.deleteById(clientId);
    }

    @Override
    public List<Release> findAvailableVersions(String clientCode, String environment) {
        if (Objects.isNull(clientCode) || clientCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Client code cannot be null or empty");
        }
        
        if (Objects.isNull(environment) || environment.trim().isEmpty()) {
            throw new IllegalArgumentException("Environment cannot be null or empty");
        }

        // Find client and environment
        var client = clientRepository.findByClientCode(clientCode);
        if (client.isEmpty()) {
            return List.of(); // No client found, no available versions
        }

        var environmentObj = environmentRepository.findByName(environment.toUpperCase());
        if (environmentObj.isEmpty()) {
            return List.of(); // No environment found, no available versions
        }

        // Find all controlled clients for this client and environment
        var controlledReleases = releaseClientEnvironmentRepository.findByClientIdAndEnvironmentId(
                client.get().getId(), environmentObj.get().getId());

        // Get all releases that are in "Controlada" or "Disponível" status for this client/environment
        return controlledReleases.stream()
                .map(rce -> releaseRepository.findById(rce.getReleaseId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(release -> release.getStatus() == ReleaseStatus.CONTROLADA || 
                                 release.getStatus() == ReleaseStatus.DISPONIVEL)
                .sorted((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt())) // Most recent first
                .toList();
    }

    private Product createProduct(String productName) {
        var product = Product.create(productName);
        return productRepository.save(product);
    }
}