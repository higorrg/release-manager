package com.empresa.app.releases.application.service;

import com.empresa.app.releases.application.port.in.UploadReleasePackageUseCase;
import com.empresa.app.releases.application.port.out.PackageStorageRepository;
import com.empresa.app.releases.application.port.out.ReleaseRepository;
import com.empresa.app.releases.domain.model.Release;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Objects;

@ApplicationScoped
public class UploadReleasePackageService implements UploadReleasePackageUseCase {
    
    private final ReleaseRepository releaseRepository;
    private final PackageStorageRepository packageStorageRepository;
    
    @Inject
    public UploadReleasePackageService(ReleaseRepository releaseRepository,
                                      PackageStorageRepository packageStorageRepository) {
        this.releaseRepository = Objects.requireNonNull(releaseRepository, "ReleaseRepository cannot be null");
        this.packageStorageRepository = Objects.requireNonNull(packageStorageRepository, "PackageStorageRepository cannot be null");
    }
    
    @Override
    @Transactional
    public Release uploadPackage(UploadPackageCommand command) {
        Objects.requireNonNull(command, "UploadPackageCommand cannot be null");
        
        var release = releaseRepository.findById(command.releaseId())
            .orElseThrow(() -> new IllegalArgumentException("Release not found"));
        
        // Armazena o pacote
        var storagePath = packageStorageRepository.store(
            command.releaseId(),
            command.fileName(),
            command.contentType(),
            command.size(),
            command.inputStream()
        );
        
        // Atualiza a URL de download da release
        release.updateDownloadUrl(storagePath);
        
        return releaseRepository.save(release);
    }
}