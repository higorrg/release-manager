package br.com.releasemanager.release.application.service;

import br.com.releasemanager.release.application.port.in.AvailableVersionResponse;
import br.com.releasemanager.release.application.port.in.ListAvailableVersionsUseCase;
import br.com.releasemanager.release.application.port.in.ListVersionsQuery;
import br.com.releasemanager.release.application.port.out.ReleaseRepository;
import br.com.releasemanager.release.domain.model.Release;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@ApplicationScoped
public class ListAvailableVersionsService implements ListAvailableVersionsUseCase {

    private final ReleaseRepository releaseRepository;

    @Inject
    public ListAvailableVersionsService(ReleaseRepository releaseRepository) {
        this.releaseRepository = Objects.requireNonNull(releaseRepository);
    }

    @Override
    public List<AvailableVersionResponse> listAvailableVersions(ListVersionsQuery query) {
        Objects.requireNonNull(query, "Query cannot be null");
        Objects.requireNonNull(query.clientCode(), "Client code cannot be null");
        Objects.requireNonNull(query.environment(), "Environment cannot be null");

        // Find releases available for the specific client and environment
        List<Release> availableReleases = releaseRepository.findAvailableForClientAndEnvironment(
            query.clientCode(), 
            query.environment(), 
            query.productName()
        );

        // Filter releases that are actually available for the environment based on status
        List<Release> filteredReleases = availableReleases.stream()
            .filter(release -> release.isAvailableForEnvironment(query.environment()))
            .collect(Collectors.toList());

        // Convert to response DTOs
        return filteredReleases.stream()
            .map(AvailableVersionResponse::from)
            .sorted((v1, v2) -> {
                // Sort by version in descending order (newest first)
                return v2.version().isNewerThan(v1.version()) ? 1 : 
                       v1.version().isNewerThan(v2.version()) ? -1 : 0;
            })
            .collect(Collectors.toList());
    }
}
