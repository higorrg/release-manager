package com.empresa.app.release.adapter.out;

import com.empresa.app.release.application.port.out.ReleaseRepository;
import com.empresa.app.release.domain.model.Release;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ReleaseJpaRepository implements ReleaseRepository {

    @Override
    @Transactional
    public Release save(Release release) {
        var entity = ReleaseEntity.findById(release.getId());
        if (entity != null) {
            var existingEntity = (ReleaseEntity) entity;
            existingEntity.updateFrom(release);
            existingEntity.persist();
            return existingEntity.toDomain();
        } else {
            var newEntity = ReleaseEntity.from(release);
            newEntity.persist();
            return newEntity.toDomain();
        }
    }

    @Override
    public Optional<Release> findById(UUID id) {
        return ReleaseEntity.<ReleaseEntity>findByIdOptional(id)
                .map(ReleaseEntity::toDomain);
    }

    @Override
    public Optional<Release> findByProductIdAndVersion(UUID productId, String version) {
        return ReleaseEntity.<ReleaseEntity>find("productId = ?1 and version = ?2", productId, version)
                .firstResultOptional()
                .map(ReleaseEntity::toDomain);
    }

    @Override
    public List<Release> findByProductId(UUID productId) {
        return ReleaseEntity.<ReleaseEntity>find("productId = ?1 order by createdAt desc", productId)
                .stream()
                .map(ReleaseEntity::toDomain)
                .toList();
    }

    @Override
    public List<Release> findByProductIdAndStatus(UUID productId, List<String> statuses) {
        return ReleaseEntity.<ReleaseEntity>find("productId = ?1 and status in (?2) order by createdAt desc", 
                        productId, statuses)
                .stream()
                .map(ReleaseEntity::toDomain)
                .toList();
    }

    @Override
    public boolean existsByProductIdAndVersion(UUID productId, String version) {
        return ReleaseEntity.count("productId = ?1 and version = ?2", productId, version) > 0;
    }

    @Override
    public List<Release> findAll() {
        return ReleaseEntity.<ReleaseEntity>findAll()
                .stream()
                .map(ReleaseEntity::toDomain)
                .toList();
    }
}