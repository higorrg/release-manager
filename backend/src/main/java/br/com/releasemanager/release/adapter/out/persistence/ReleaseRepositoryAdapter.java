package br.com.releasemanager.release.adapter.out.persistence;

import br.com.releasemanager.release.application.port.out.ReleaseRepository;
import br.com.releasemanager.release.domain.model.Environment;
import br.com.releasemanager.release.domain.model.Release;
import br.com.releasemanager.release.domain.model.Version;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class ReleaseRepositoryAdapter implements ReleaseRepository {

    @Inject
    EntityManager entityManager;

    @Override
    public Release save(Release release) {
        ReleaseEntity entity = new ReleaseEntity(release);
        if (entity.getId() == null) {
            entityManager.persist(entity);
        } else {
            entity = entityManager.merge(entity);
        }
        return entity.toDomain();
    }

    @Override
    public Optional<Release> findById(Long id) {
        ReleaseEntity entity = entityManager.find(ReleaseEntity.class, id);
        return entity != null ? Optional.of(entity.toDomain()) : Optional.empty();
    }

    @Override
    public Optional<Release> findByProductNameAndVersion(String productName, Version version) {
        try {
            ReleaseEntity entity = entityManager
                .createQuery("SELECT r FROM ReleaseEntity r WHERE r.productName = :productName AND r.versionFull = :versionFull", ReleaseEntity.class)
                .setParameter("productName", productName)
                .setParameter("versionFull", version.getFullVersion())
                .getSingleResult();
            return Optional.of(entity.toDomain());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Release> findByProductName(String productName) {
        return entityManager
            .createQuery("SELECT r FROM ReleaseEntity r WHERE r.productName = :productName", ReleaseEntity.class)
            .setParameter("productName", productName)
            .getResultList()
            .stream()
            .map(ReleaseEntity::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<Release> findAvailableForClientAndEnvironment(String clientCode, Environment environment, String productName) {
        String query = """
            SELECT DISTINCT r FROM ReleaseEntity r 
            JOIN ReleaseClientEnvironmentEntity rce ON r.id = rce.releaseId 
            WHERE rce.clientCode = :clientCode 
            AND rce.environment = :environment
            """ + (productName != null ? " AND r.productName = :productName" : "") + """
            ORDER BY r.versionMajor DESC, r.versionMinor DESC, r.versionPatch DESC
            """;

        var typedQuery = entityManager.createQuery(query, ReleaseEntity.class)
            .setParameter("clientCode", clientCode)
            .setParameter("environment", environment);

        if (productName != null) {
            typedQuery.setParameter("productName", productName);
        }

        return typedQuery.getResultList()
            .stream()
            .map(ReleaseEntity::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<Release> findAll() {
        return entityManager
            .createQuery("SELECT r FROM ReleaseEntity r", ReleaseEntity.class)
            .getResultList()
            .stream()
            .map(ReleaseEntity::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        ReleaseEntity entity = entityManager.find(ReleaseEntity.class, id);
        if (entity != null) {
            entityManager.remove(entity);
        }
    }

    @Override
    public boolean existsByProductNameAndVersion(String productName, Version version) {
        Long count = entityManager
            .createQuery("SELECT COUNT(r) FROM ReleaseEntity r WHERE r.productName = :productName AND r.versionFull = :versionFull", Long.class)
            .setParameter("productName", productName)
            .setParameter("versionFull", version.getFullVersion())
            .getSingleResult();
        return count > 0;
    }
}
