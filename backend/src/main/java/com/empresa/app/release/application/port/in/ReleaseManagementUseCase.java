package com.empresa.app.release.application.port.in;

import com.empresa.app.release.domain.model.Client;
import com.empresa.app.release.domain.model.Environment;
import com.empresa.app.release.domain.model.Release;
import com.empresa.app.release.domain.model.ReleaseClientEnvironment;
import com.empresa.app.release.domain.model.ReleaseStatus;
import com.empresa.app.release.domain.model.ReleaseStatusHistory;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReleaseManagementUseCase {
    
    /**
     * Cria uma nova release a partir da pipeline
     */
    Release createReleaseFromPipeline(CreateReleaseCommand command);
    
    /**
     * Atualiza o status de uma release
     */
    Release updateReleaseStatus(UpdateReleaseStatusCommand command);
    
    /**
     * Atualiza release notes de uma release
     */
    Release updateReleaseNotes(UpdateReleaseNotesCommand command);
    
    /**
     * Atualiza pré-requisitos de uma release
     */
    Release updatePrerequisites(UpdatePrerequisitesCommand command);
    
    /**
     * Busca uma release por ID
     */
    Optional<Release> findReleaseById(UUID releaseId);
    
    /**
     * Lista todas as releases
     */
    List<Release> findAllReleases();
    
    /**
     * Lista todas as releases de um produto
     */
    List<Release> findReleasesByProduct(UUID productId);
    
    /**
     * Lista o histórico de mudanças de status de uma release
     */
    List<ReleaseStatusHistory> findReleaseStatusHistory(UUID releaseId);
    
    /**
     * Associa um cliente a uma release em um ambiente específico
     */
    ReleaseClientEnvironment addControlledClient(AddControlledClientCommand command);
    
    /**
     * Remove um cliente controlado de uma release
     */
    void removeControlledClient(UUID releaseId, UUID clientId, UUID environmentId);
    
    /**
     * Lista clientes controlados de uma release
     */
    List<ReleaseClientEnvironment> findControlledClients(UUID releaseId);
    
    /**
     * Lista todos os clientes disponíveis
     */
    List<Client> findAllClients();
    
    /**
     * Lista todos os ambientes disponíveis
     */
    List<Environment> findAllEnvironments();
    
    /**
     * Busca ou cria um cliente pelo código
     */
    Client findOrCreateClient(String clientCode);
    
    /**
     * Busca um cliente por ID
     */
    Optional<Client> findClientById(UUID clientId);
    
    /**
     * Cria um novo cliente
     */
    Client createClient(CreateClientCommand command);
    
    /**
     * Atualiza um cliente existente
     */
    Client updateClient(UpdateClientCommand command);
    
    /**
     * Exclui um cliente (apenas se não estiver em uso)
     */
    void deleteClient(UUID clientId);
    
    /**
     * Lista versões disponíveis para um cliente em um ambiente específico
     */
    List<Release> findAvailableVersions(String clientCode, String environment);
    
    /**
     * Atualiza informações de pacote da release (URL de download e caminho do pacote)
     */
    Release updatePackageInfo(UpdatePackageInfoCommand command);
    
    record CreateReleaseCommand(String productName, String version) {}
    
    record UpdateReleaseStatusCommand(UUID releaseId, ReleaseStatus newStatus, 
                                    String changedBy, String comments) {}
    
    record UpdateReleaseNotesCommand(UUID releaseId, String releaseNotes) {}
    
    record UpdatePrerequisitesCommand(UUID releaseId, String prerequisites) {}
    
    record UpdatePackageInfoCommand(UUID releaseId, String downloadUrl, String packagePath) {}
    
    record CreateClientCommand(String clientCode, String name, String description) {}
    
    record UpdateClientCommand(UUID clientId, String name, String description) {}
    
    record AddControlledClientCommand(UUID releaseId, String clientCode, String environmentName) {}
}