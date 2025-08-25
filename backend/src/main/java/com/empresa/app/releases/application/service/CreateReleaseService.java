package com.empresa.app.releases.application.service;

import com.empresa.app.releases.application.port.in.CreateReleaseUseCase;
import com.empresa.app.releases.application.port.out.ReleaseRepository;
import com.empresa.app.releases.domain.model.Release;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Objects;

@ApplicationScoped
public class CreateReleaseService implements CreateReleaseUseCase {
    
    private final ReleaseRepository releaseRepository;
    
    @Inject
    public CreateReleaseService(ReleaseRepository releaseRepository) {
        this.releaseRepository = Objects.requireNonNull(releaseRepository, "ReleaseRepository cannot be null");
    }
    
    @Override
    @Transactional
    public Release create(CreateReleaseCommand command) {
        Objects.requireNonNull(command, "CreateReleaseCommand cannot be null");
        
        // Verifica se já existe uma release com o mesmo produto e versão
        if (releaseRepository.existsByProductNameAndVersion(command.productName(), command.version())) {
            throw new IllegalArgumentException("A release with this product name and version already exists");
        }
        
        var release = Release.create(command.productName(), command.version());
        
        // Atualiza informações opcionais se fornecidas
        if (command.releaseNotes() != null && !command.releaseNotes().trim().isEmpty()) {
            release.updateReleaseNotes(command.releaseNotes().trim());
        }
        
        if (command.prerequisites() != null && !command.prerequisites().trim().isEmpty()) {
            release.updatePrerequisites(command.prerequisites().trim());
        }
        
        if (command.downloadUrl() != null && !command.downloadUrl().trim().isEmpty()) {
            release.updateDownloadUrl(command.downloadUrl().trim());
        }
        
        return releaseRepository.save(release);
    }
}