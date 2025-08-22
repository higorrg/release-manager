package com.releasemanager.releases.application.port.in;

import com.releasemanager.releases.domain.model.Environment;
import java.util.List;

public interface ManageReleaseClientEnvironmentUseCase {
    
    record AddClientEnvironmentCommand(
        Long releaseId,
        String clientCode,
        Environment environment
    ) {}
    
    record RemoveClientEnvironmentCommand(
        Long releaseId,
        String clientCode,
        Environment environment
    ) {}
    
    record ClientEnvironmentInfo(
        Long id,
        String clientCode,
        String clientName,
        String environment
    ) {}
    
    void addClientEnvironment(AddClientEnvironmentCommand command);
    void removeClientEnvironment(RemoveClientEnvironmentCommand command);
    List<ClientEnvironmentInfo> getClientEnvironments(Long releaseId);
}