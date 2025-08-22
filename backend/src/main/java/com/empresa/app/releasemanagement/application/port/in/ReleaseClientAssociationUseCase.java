package com.empresa.app.releasemanagement.application.port.in;

import com.empresa.app.releasemanagement.domain.model.ReleaseClientEnvironment;
import java.util.List;
import java.util.UUID;

public interface ReleaseClientAssociationUseCase {
    
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
    
    record AddControlledClientCommand(UUID releaseId, String clientCode, String environmentName) {}
}