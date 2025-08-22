package com.empresa.app.releasemanagement.adapter.out;

import com.empresa.app.releasemanagement.application.port.out.ReleaseClientEnvironmentRepository;
import com.empresa.app.releasemanagement.domain.model.ReleaseClientEnvironment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ReleaseClientEnvironmentJpaRepository implements ReleaseClientEnvironmentRepository {

    @Override
    @Transactional
    public ReleaseClientEnvironment save(ReleaseClientEnvironment rce) {
        var entity = ReleaseClientEnvironmentEntity.from(rce);
        entity.persist();
        return entity.toDomain();
    }

    @Override
    public Optional<ReleaseClientEnvironment> findById(UUID id) {
        return ReleaseClientEnvironmentEntity.<ReleaseClientEnvironmentEntity>findByIdOptional(id)
                .map(ReleaseClientEnvironmentEntity::toDomain);
    }

    @Override
    public List<ReleaseClientEnvironment> findByReleaseId(UUID releaseId) {
        return ReleaseClientEnvironmentEntity.<ReleaseClientEnvironmentEntity>find("releaseId = ?1", releaseId)
                .stream()
                .map(ReleaseClientEnvironmentEntity::toDomain)
                .toList();
    }

    @Override
    public List<ReleaseClientEnvironment> findByClientId(UUID clientId) {
        return ReleaseClientEnvironmentEntity.<ReleaseClientEnvironmentEntity>find("clientId = ?1", clientId)
                .stream()
                .map(ReleaseClientEnvironmentEntity::toDomain)
                .toList();
    }

    @Override
    public List<ReleaseClientEnvironment> findByEnvironmentId(UUID environmentId) {
        return ReleaseClientEnvironmentEntity.<ReleaseClientEnvironmentEntity>find("environmentId = ?1", environmentId)
                .stream()
                .map(ReleaseClientEnvironmentEntity::toDomain)
                .toList();
    }

    @Override
    public List<ReleaseClientEnvironment> findByClientIdAndEnvironmentId(UUID clientId, UUID environmentId) {
        return ReleaseClientEnvironmentEntity.<ReleaseClientEnvironmentEntity>find(
                        "clientId = ?1 and environmentId = ?2", clientId, environmentId)
                .stream()
                .map(ReleaseClientEnvironmentEntity::toDomain)
                .toList();
    }

    @Override
    public Optional<ReleaseClientEnvironment> findByReleaseIdAndClientIdAndEnvironmentId(
            UUID releaseId, UUID clientId, UUID environmentId) {
        return ReleaseClientEnvironmentEntity.<ReleaseClientEnvironmentEntity>find(
                        "releaseId = ?1 and clientId = ?2 and environmentId = ?3", 
                        releaseId, clientId, environmentId)
                .firstResultOptional()
                .map(ReleaseClientEnvironmentEntity::toDomain);
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        ReleaseClientEnvironmentEntity.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteByReleaseId(UUID releaseId) {
        ReleaseClientEnvironmentEntity.delete("releaseId = ?1", releaseId);
    }
}