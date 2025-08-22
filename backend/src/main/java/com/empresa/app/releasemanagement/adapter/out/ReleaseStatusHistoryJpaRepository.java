package com.empresa.app.releasemanagement.adapter.out;

import com.empresa.app.releasemanagement.application.port.out.ReleaseStatusHistoryRepository;
import com.empresa.app.releasemanagement.domain.model.ReleaseStatusHistory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ReleaseStatusHistoryJpaRepository implements ReleaseStatusHistoryRepository {

    @Override
    @Transactional
    public ReleaseStatusHistory save(ReleaseStatusHistory history) {
        var entity = ReleaseStatusHistoryEntity.from(history);
        entity.persist();
        return entity.toDomain();
    }

    @Override
    public List<ReleaseStatusHistory> findByReleaseIdOrderByChangedAtDesc(UUID releaseId) {
        return ReleaseStatusHistoryEntity.<ReleaseStatusHistoryEntity>find(
                        "releaseId = ?1 order by changedAt desc", releaseId)
                .stream()
                .map(ReleaseStatusHistoryEntity::toDomain)
                .toList();
    }

    @Override
    public List<ReleaseStatusHistory> findByReleaseIdOrderByChangedAtAsc(UUID releaseId) {
        return ReleaseStatusHistoryEntity.<ReleaseStatusHistoryEntity>find(
                        "releaseId = ?1 order by changedAt asc", releaseId)
                .stream()
                .map(ReleaseStatusHistoryEntity::toDomain)
                .toList();
    }
}