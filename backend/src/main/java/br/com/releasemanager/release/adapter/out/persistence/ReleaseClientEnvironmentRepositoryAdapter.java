package br.com.releasemanager.release.adapter.out.persistence;

import br.com.releasemanager.release.application.port.out.ReleaseClientEnvironmentRepository;
import br.com.releasemanager.release.domain.model.Environment;
import br.com.releasemanager.release.domain.model.ReleaseClientEnvironment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class ReleaseClientEnvironmentRepositoryAdapter implements ReleaseClientEnvironmentRepository {

    @Inject
    EntityManager entityManager;

    @Override
    public ReleaseClientEnvironment save(ReleaseClientEnvironment clientEnvironment) {
        ReleaseClientEnvironmentEntity entity = new ReleaseClientEnvironmentEntity(clientEnvironment);
        if (entity.getId() == null) {
            entityManager.persist(entity);
        } else {
            entity = entityManager.merge(entity);
        }
        return entity.toDomain();
    }

    @Override
    public Optional<ReleaseClientEnvironment> findByReleaseIdAndClientCodeAndEnvironment(
            Long releaseId, String clientCode, Environment environment) {
        try {
            ReleaseClientEnvironmentEntity entity = entityManager
                .createQuery("SELECT rce FROM ReleaseClientEnvironmentEntity rce WHERE rce.releaseId = :releaseId AND rce.clientCode = :clientCode AND rce.environment = :environment", ReleaseClientEnvironmentEntity.class)
                .setParameter("releaseId", releaseId)
                .setParameter("clientCode", clientCode)
                .setParameter("environment", environment)
                .getSingleResult();
            return Optional.of(entity.toDomain());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ReleaseClientEnvironment> findByReleaseId(Long releaseId) {
        return entityManager
            .createQuery("SELECT rce FROM ReleaseClientEnvironmentEntity rce WHERE rce.releaseId = :releaseId", ReleaseClientEnvironmentEntity.class)
            .setParameter("releaseId", releaseId)
            .getResultList()
            .stream()
            .map(ReleaseClientEnvironmentEntity::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<ReleaseClientEnvironment> findByClientCodeAndEnvironment(String clientCode, Environment environment) {
        return entityManager
            .createQuery("SELECT rce FROM ReleaseClientEnvironmentEntity rce WHERE rce.clientCode = :clientCode AND rce.environment = :environment", ReleaseClientEnvironmentEntity.class)
            .setParameter("clientCode", clientCode)
            .setParameter("environment", environment)
            .getResultList()
            .stream()
            .map(ReleaseClientEnvironmentEntity::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public void deleteByReleaseIdAndClientCodeAndEnvironment(Long releaseId, String clientCode, Environment environment) {
        entityManager
            .createQuery("DELETE FROM ReleaseClientEnvironmentEntity rce WHERE rce.releaseId = :releaseId AND rce.clientCode = :clientCode AND rce.environment = :environment")
            .setParameter("releaseId", releaseId)
            .setParameter("clientCode", clientCode)
            .setParameter("environment", environment)
            .executeUpdate();
    }

    @Override
    public boolean existsByReleaseIdAndClientCodeAndEnvironment(Long releaseId, String clientCode, Environment environment) {
        Long count = entityManager
            .createQuery("SELECT COUNT(rce) FROM ReleaseClientEnvironmentEntity rce WHERE rce.releaseId = :releaseId AND rce.clientCode = :clientCode AND rce.environment = :environment", Long.class)
            .setParameter("releaseId", releaseId)
            .setParameter("clientCode", clientCode)
            .setParameter("environment", environment)
            .getSingleResult();
        return count > 0;
    }
}