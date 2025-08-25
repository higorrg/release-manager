package com.empresa.app.releases.application.service;

import com.empresa.app.releases.application.port.in.RemoveClientFromReleaseUseCase;
import com.empresa.app.releases.application.port.out.ReleaseClientEnvironmentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Objects;

@ApplicationScoped
public class RemoveClientFromReleaseService implements RemoveClientFromReleaseUseCase {
    
    private final ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository;
    
    @Inject
    public RemoveClientFromReleaseService(ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository) {
        this.releaseClientEnvironmentRepository = Objects.requireNonNull(releaseClientEnvironmentRepository, "ReleaseClientEnvironmentRepository cannot be null");
    }
    
    @Override
    @Transactional
    public void removeClientFromRelease(RemoveClientCommand command) {
        Objects.requireNonNull(command, "RemoveClientCommand cannot be null");
        
        var releaseClientEnvironment = releaseClientEnvironmentRepository
            .findByReleaseIdAndClientCodeAndEnvironment(
                command.releaseId(), 
                command.clientCode(), 
                command.environment()
            )
            .orElseThrow(() -> new IllegalArgumentException("Client is not associated with this release for the specified environment"));
        
        releaseClientEnvironmentRepository.delete(releaseClientEnvironment);
    }
}