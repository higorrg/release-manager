package com.empresa.app.release.application.port.out;

import com.empresa.app.release.domain.model.ReleaseClientEnvironment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReleaseClientEnvironmentRepository {
    
    /**
     * Salva uma associação release-client-environment
     */
    ReleaseClientEnvironment save(ReleaseClientEnvironment rce);
    
    /**
     * Busca uma associação por ID
     */
    Optional<ReleaseClientEnvironment> findById(UUID id);
    
    /**
     * Busca associações por release ID
     */
    List<ReleaseClientEnvironment> findByReleaseId(UUID releaseId);
    
    /**
     * Busca associações por client ID
     */
    List<ReleaseClientEnvironment> findByClientId(UUID clientId);
    
    /**
     * Busca associações por environment ID
     */
    List<ReleaseClientEnvironment> findByEnvironmentId(UUID environmentId);
    
    /**
     * Busca associações por client ID e environment ID
     */
    List<ReleaseClientEnvironment> findByClientIdAndEnvironmentId(UUID clientId, UUID environmentId);
    
    /**
     * Busca uma associação específica
     */
    Optional<ReleaseClientEnvironment> findByReleaseIdAndClientIdAndEnvironmentId(
            UUID releaseId, UUID clientId, UUID environmentId);
    
    /**
     * Remove uma associação
     */
    void deleteById(UUID id);
    
    /**
     * Remove associações por release ID
     */
    void deleteByReleaseId(UUID releaseId);
}