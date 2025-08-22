package com.releasemanager.audit.adapter.out;

import com.releasemanager.audit.application.port.out.ReleaseStatusHistoryRepository;
import com.releasemanager.audit.domain.model.ReleaseStatusHistory;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ReleaseStatusHistoryJpaRepository implements ReleaseStatusHistoryRepository, 
                                                          PanacheRepository<ReleaseStatusHistory> {

    @Override
    public ReleaseStatusHistory save(ReleaseStatusHistory history) {
        persist(history);
        return history;
    }

    @Override
    public List<ReleaseStatusHistory> findByReleaseId(Long releaseId) {
        return list("release.id", releaseId);
    }

    @Override
    public List<ReleaseStatusHistory> findByReleaseIdOrderByChangedAtDesc(Long releaseId) {
        return list("release.id = ?1 order by changedAt desc", releaseId);
    }
}