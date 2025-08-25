package com.empresa.app.releases.application.service;

import com.empresa.app.releases.application.port.in.GetAvailableReleasesForClientUseCase;
import com.empresa.app.releases.application.port.out.ReleaseClientEnvironmentRepository;
import com.empresa.app.releases.application.port.out.ReleaseRepository;
import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.shared.domain.ReleaseStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@ApplicationScoped
public class GetAvailableReleasesForClientService implements GetAvailableReleasesForClientUseCase {
    
    private final ReleaseRepository releaseRepository;
    private final ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository;
    
    @Inject
    public GetAvailableReleasesForClientService(ReleaseRepository releaseRepository,
                                               ReleaseClientEnvironmentRepository releaseClientEnvironmentRepository) {
        this.releaseRepository = Objects.requireNonNull(releaseRepository, "ReleaseRepository cannot be null");
        this.releaseClientEnvironmentRepository = Objects.requireNonNull(releaseClientEnvironmentRepository, "ReleaseClientEnvironmentRepository cannot be null");
    }
    
    @Override
    public List<Release> getAvailableReleases(GetAvailableReleasesQuery query) {
        Objects.requireNonNull(query, "GetAvailableReleasesQuery cannot be null");
        
        // Busca todos os relacionamentos do cliente para o ambiente especificado
        var clientReleases = releaseClientEnvironmentRepository
            .findByClientCodeAndEnvironment(query.clientCode(), query.environment());
        
        // Extrai os IDs das releases
        var releaseIds = clientReleases.stream()
            .map(rel -> rel.getReleaseId())
            .collect(Collectors.toSet());
        
        // Busca todas as releases com status DISPONIVEL ou CONTROLADA
        var availableReleases = releaseRepository.findByStatus(ReleaseStatus.DISPONIVEL);
        var controlledReleases = releaseRepository.findByStatus(ReleaseStatus.CONTROLADA);
        
        // Combina as listas
        availableReleases.addAll(controlledReleases);
        
        // Filtra para retornar apenas as releases que estão associadas ao cliente
        // ou que são DISPONIVEL (disponível para todos)
        return availableReleases.stream()
            .filter(release -> 
                release.getStatus() == ReleaseStatus.DISPONIVEL || 
                releaseIds.contains(release.getId())
            )
            .distinct()
            .collect(Collectors.toList());
    }
}