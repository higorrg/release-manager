package com.releasemanager.history.adapter.out.persistence;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ReleaseStatusHistoryPanacheRepository implements PanacheRepository<ReleaseStatusHistoryJpaEntity> {
    // Panache provides the basic persist methods, which is all we need for now.
}
