package com.empresa.app.releases.application.service;

import com.empresa.app.releases.application.port.in.DownloadReleasePackageUseCase;
import com.empresa.app.releases.application.port.out.PackageStorageRepository;
import com.empresa.app.releases.application.port.out.ReleaseClientEnvironmentRepository;
import com.empresa.app.releases.application.port.out.ReleaseRepository;
import com.empresa.app.shared.domain.ReleaseStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.Objects;

@ApplicationScoped
public class DownloadReleasePackageService implements DownloadReleasePackageUseCase {
    
    private final ReleaseRepository releaseRepository;
    private final ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository;
    private final PackageStorageRepository packageStorageRepository;
    
    @Inject
    public DownloadReleasePackageService(ReleaseRepository releaseRepository,
                                        ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository,
                                        PackageStorageRepository packageStorageRepository) {
        this.releaseRepository = Objects.requireNonNull(releaseRepository, "ReleaseRepository cannot be null");
        this.releaseClientEnvironmentRepository = Objects.requireNonNull(releaseClientEnvironmentRepository, "ReleaseClientEnvironmentRepository cannot be null");
        this.packageStorageRepository = Objects.requireNonNull(packageStorageRepository, "PackageStorageRepository cannot be null");
    }
    
    @Override
    public PackageDownload downloadPackage(DownloadPackageQuery query) {
        Objects.requireNonNull(query, "DownloadPackageQuery cannot be null");
        
        var release = releaseRepository.findById(query.releaseId())
            .orElseThrow(() -> new IllegalArgumentException("Release not found"));
        
        // Verifica se a release está disponível
        if (!release.isAvailableForClient()) {
            throw new IllegalArgumentException("Release is not available for download");
        }
        
        // Se a release for CONTROLADA, verifica se o cliente tem permissão
        if (release.getStatus() == ReleaseStatus.CONTROLADA) {
            var hasAccess = releaseClientEnvironmentRepository
                .existsByReleaseIdAndClientCodeAndEnvironment(
                    query.releaseId(), 
                    query.clientCode(), 
                    query.environment()
                );
            
            if (!hasAccess) {
                throw new IllegalArgumentException("Client does not have access to this controlled release");
            }
        }
        
        // Busca informações do pacote
        var packageInfo = packageStorageRepository.getPackageInfo(query.releaseId())
            .orElseThrow(() -> new IllegalArgumentException("Package not found"));
        
        // Busca o stream do pacote
        var inputStream = packageStorageRepository.getPackageStream(query.releaseId())
            .orElseThrow(() -> new IllegalArgumentException("Package stream not available"));
        
        return new PackageDownload(
            packageInfo.fileName(),
            packageInfo.contentType(),
            packageInfo.size(),
            inputStream
        );
    }
}