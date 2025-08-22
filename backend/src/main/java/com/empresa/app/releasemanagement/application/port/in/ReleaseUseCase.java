package com.empresa.app.releasemanagement.application.port.in;

import com.empresa.app.releasemanagement.domain.model.Release;
import com.empresa.app.releasemanagement.domain.model.ReleaseStatus;
import com.empresa.app.releasemanagement.domain.model.ReleaseStatusHistory;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReleaseUseCase {
    
    /**
     * Cria uma nova release a partir da pipeline
     */
    Release createReleaseFromPipeline(CreateReleaseCommand command);
    
    /**
     * Cria uma nova release a partir da interface web
     */
    Release createReleaseFromWeb(CreateReleaseCommand command);
    
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
     * Atualiza informações de pacote da release (URL de download e caminho do pacote)
     */
    Release updatePackageInfo(UpdatePackageInfoCommand command);
    
    /**
     * Busca uma release por ID
     */
    Optional<Release> findReleaseById(UUID releaseId);
    
    /**
     * Busca uma release por nome do produto e versão
     */
    Optional<Release> findByProductNameAndVersion(String productName, String version);
    
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
     * Lista versões disponíveis para um cliente em um ambiente específico
     */
    List<Release> findAvailableVersions(String clientCode, String environment);
    
    record CreateReleaseCommand(String productName, String version) {}
    
    record UpdateReleaseStatusCommand(UUID releaseId, ReleaseStatus newStatus, 
                                    String changedBy, String comments) {}
    
    record UpdateReleaseNotesCommand(UUID releaseId, String releaseNotes) {}
    
    record UpdatePrerequisitesCommand(UUID releaseId, String prerequisites) {}
    
    record UpdatePackageInfoCommand(UUID releaseId, String downloadUrl) {}
}