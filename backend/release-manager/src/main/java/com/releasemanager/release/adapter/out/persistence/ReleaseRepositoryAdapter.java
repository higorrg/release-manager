package com.releasemanager.release.adapter.out.persistence;

import com.releasemanager.release.application.port.out.ReleaseRepository;
import com.releasemanager.release.domain.model.Release;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.Optional;

@ApplicationScoped
public class ReleaseRepositoryAdapter implements ReleaseRepository {

    private final ReleasePanacheRepository panacheRepository;
    private final ReleaseMapper mapper;

    @Inject
    public ReleaseRepositoryAdapter(ReleasePanacheRepository panacheRepository, ReleaseMapper mapper) {
        this.panacheRepository = panacheRepository;
        this.mapper = mapper;
    }

    @Override
    public Release save(Release release) {
        ReleaseJpaEntity entity = panacheRepository
            .findByProductNameAndVersion(release.getProductName(), release.getVersion())
            .orElseGet(ReleaseJpaEntity::new);

        mapper.updateEntityFromDomain(release, entity);

        panacheRepository.persist(entity);
        return mapper.toDomain(entity);
    }

    @Override
    public Optional<Release> findByProductNameAndVersion(String productName, String version) {
        return panacheRepository.findByProductNameAndVersion(productName, version)
            .map(mapper::toDomain);
    }
}
