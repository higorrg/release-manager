package com.releasemanager.release.adapter.out.persistence;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class ReleasePanacheRepository implements PanacheRepository<ReleaseJpaEntity> {

    public Optional<ReleaseJpaEntity> findByProductNameAndVersion(String productName, String version) {
        return find("productName = ?1 and version = ?2", productName, version).firstResultOptional();
    }
}
