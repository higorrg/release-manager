package com.releasemanager.history.adapter.out.persistence;

import com.releasemanager.history.application.port.out.ReleaseStatusHistoryRepository;
import com.releasemanager.history.domain.model.ReleaseStatusHistory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class ReleaseStatusHistoryRepositoryAdapter implements ReleaseStatusHistoryRepository {

    private final ReleaseStatusHistoryPanacheRepository panacheRepository;
    private final ReleaseStatusHistoryMapper mapper;

    @Inject
    public ReleaseStatusHistoryRepositoryAdapter(ReleaseStatusHistoryPanacheRepository panacheRepository, ReleaseStatusHistoryMapper mapper) {
        this.panacheRepository = panacheRepository;
        this.mapper = mapper;
    }

    @Override
    public void save(ReleaseStatusHistory history) {
        ReleaseStatusHistoryJpaEntity entity = mapper.toEntity(history);
        panacheRepository.persist(entity);
    }
}
