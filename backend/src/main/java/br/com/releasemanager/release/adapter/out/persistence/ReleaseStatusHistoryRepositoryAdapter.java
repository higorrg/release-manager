package br.com.releasemanager.release.adapter.out.persistence;

import br.com.releasemanager.release.application.port.out.ReleaseStatusHistoryRepository;
import br.com.releasemanager.release.domain.model.ReleaseStatusHistory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ReleaseStatusHistoryRepositoryAdapter implements ReleaseStatusHistoryRepository {

    @Inject
    EntityManager entityManager;

    @Override
    public ReleaseStatusHistory save(ReleaseStatusHistory statusHistory) {
        ReleaseStatusHistoryEntity entity = new ReleaseStatusHistoryEntity(statusHistory);
        if (entity.getId() == null) {
            entityManager.persist(entity);
        } else {
            entity = entityManager.merge(entity);
        }
        return entity.toDomain();
    }

    @Override
    public List<ReleaseStatusHistory> findByReleaseId(Long releaseId) {
        return entityManager
            .createQuery("SELECT h FROM ReleaseStatusHistoryEntity h WHERE h.releaseId = :releaseId", ReleaseStatusHistoryEntity.class)
            .setParameter("releaseId", releaseId)
            .getResultList()
            .stream()
            .map(ReleaseStatusHistoryEntity::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<ReleaseStatusHistory> findByReleaseIdOrderByChangedAtDesc(Long releaseId) {
        return entityManager
            .createQuery("SELECT h FROM ReleaseStatusHistoryEntity h WHERE h.releaseId = :releaseId ORDER BY h.changedAt DESC", ReleaseStatusHistoryEntity.class)
            .setParameter("releaseId", releaseId)
            .getResultList()
            .stream()
            .map(ReleaseStatusHistoryEntity::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<ReleaseStatusHistory> findAll() {
        return entityManager
            .createQuery("SELECT h FROM ReleaseStatusHistoryEntity h", ReleaseStatusHistoryEntity.class)
            .getResultList()
            .stream()
            .map(ReleaseStatusHistoryEntity::toDomain)
            .collect(Collectors.toList());
    }
}