package com.empresa.app.release.application.port.in;

import com.empresa.app.release.domain.model.Release;
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
     * Lista todas as releases de um produto
     */
    List<Release> findReleasesByProduct(UUID productId);
    
    /**
     * Lista o histórico de mudanças de status de uma release
     */
    List<ReleaseStatusHistory> findReleaseStatusHistory(UUID releaseId);
    
    record CreateReleaseCommand(String productName, String version) {}
    
    record UpdateReleaseStatusCommand(UUID releaseId, ReleaseStatus newStatus, 
                                    String changedBy, String comments) {}
    
    record UpdateReleaseNotesCommand(UUID releaseId, String releaseNotes) {}
    
    record UpdatePrerequisitesCommand(UUID releaseId, String prerequisites) {}
}