package com.empresa.app.release.application.port.out;

import com.empresa.app.release.domain.model.ReleaseStatusHistory;
import java.util.List;
import java.util.UUID;

public interface ReleaseStatusHistoryRepository {
    
    /**
     * Salva um histórico de status
     */
    ReleaseStatusHistory save(ReleaseStatusHistory history);
    
    /**
     * Busca histórico por release ID ordenado por data decrescente
     */
    List<ReleaseStatusHistory> findByReleaseIdOrderByChangedAtDesc(UUID releaseId);
    
    /**
     * Busca histórico por release ID ordenado por data crescente
     */
    List<ReleaseStatusHistory> findByReleaseIdOrderByChangedAtAsc(UUID releaseId);
}