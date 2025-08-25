package com.empresa.app.releases.application.service;

import com.empresa.app.clients.domain.model.ClientCode;
import com.empresa.app.releases.application.port.in.GetReleaseClientsUseCase;
import com.empresa.app.releases.application.port.out.ReleaseClientEnvironmentRepository;
import com.empresa.app.releases.domain.model.ReleaseClientEnvironment;
import com.empresa.app.releases.domain.model.ReleaseId;
import com.empresa.app.shared.domain.Environment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class GetReleaseClientsService implements GetReleaseClientsUseCase {
    
    private final ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository;
    
    @Inject
    public GetReleaseClientsService(ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository) {
        this.releaseClientEnvironmentRepository = Objects.requireNonNull(releaseClientEnvironmentRepository, "ReleaseClientEnvironmentRepository cannot be null");
    }
    
    @Override
    public List<ReleaseClientEnvironment> getReleaseClients(ReleaseId releaseId) {
        Objects.requireNonNull(releaseId, "ReleaseId cannot be null");
        
        return releaseClientEnvironmentRepository.findByReleaseId(releaseId);
    }
    
    @Override
    public List<ReleaseClientEnvironment> getClientReleases(ClientCode clientCode, Environment environment) {
        Objects.requireNonNull(clientCode, "ClientCode cannot be null");
        Objects.requireNonNull(environment, "Environment cannot be null");
        
        return releaseClientEnvironmentRepository.findByClientCodeAndEnvironment(clientCode, environment);
    }
}