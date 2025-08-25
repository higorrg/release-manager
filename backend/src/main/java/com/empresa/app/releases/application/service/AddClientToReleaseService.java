package com.empresa.app.releases.application.service;

import com.empresa.app.releases.application.port.in.AddClientToReleaseUseCase;
import com.empresa.app.releases.application.port.out.ReleaseClientEnvironmentRepository;
import com.empresa.app.releases.application.port.out.ReleaseRepository;
import com.empresa.app.releases.domain.model.ReleaseClientEnvironment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Objects;

@ApplicationScoped
public class AddClientToReleaseService implements AddClientToReleaseUseCase {
    
    private final ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository;
    private final ReleaseRepository releaseRepository;
    
    @Inject
    public AddClientToReleaseService(ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository,
                                    ReleaseRepository releaseRepository) {
        this.releaseClientEnvironmentRepository = Objects.requireNonNull(releaseClientEnvironmentRepository, "ReleaseClientEnvironmentRepository cannot be null");
        this.releaseRepository = Objects.requireNonNull(releaseRepository, "ReleaseRepository cannot be null");
    }
    
    @Override
    @Transactional
    public ReleaseClientEnvironment addClientToRelease(AddClientCommand command) {
        Objects.requireNonNull(command, "AddClientCommand cannot be null");
        
        // Verifica se a release existe
        releaseRepository.findById(command.releaseId())
            .orElseThrow(() -> new IllegalArgumentException("Release not found"));
        
        // Verifica se já existe um relacionamento
        if (releaseClientEnvironmentRepository.existsByReleaseIdAndClientCodeAndEnvironment(
                command.releaseId(), command.clientCode(), command.environment())) {
            throw new IllegalArgumentException("Client is already associated with this release for the specified environment");
        }
        
        var releaseClientEnvironment = ReleaseClientEnvironment.create(
            command.releaseId(),
            command.clientCode(),
            command.environment()
        );
        
        return releaseClientEnvironmentRepository.save(releaseClientEnvironment);
    }
}