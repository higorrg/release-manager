package com.empresa.app.release.adapter.out;

import com.empresa.app.release.application.port.out.EnvironmentRepository;
import com.empresa.app.release.domain.model.Environment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class EnvironmentJpaRepository implements EnvironmentRepository {

    @Override
    @Transactional
    public Environment save(Environment environment) {
        var entity = EnvironmentEntity.findById(environment.getId());
        if (entity != null) {
            var existingEntity = (EnvironmentEntity) entity;
            existingEntity.name = environment.getName();
            existingEntity.description = environment.getDescription();
            existingEntity.persist();
            return existingEntity.toDomain();
        } else {
            var newEntity = EnvironmentEntity.from(environment);
            newEntity.persist();
            return newEntity.toDomain();
        }
    }

    @Override
    public Optional<Environment> findById(UUID id) {
        return EnvironmentEntity.<EnvironmentEntity>findByIdOptional(id)
                .map(EnvironmentEntity::toDomain);
    }

    @Override
    public Optional<Environment> findByName(String name) {
        return EnvironmentEntity.<EnvironmentEntity>find("name = ?1", name)
                .firstResultOptional()
                .map(EnvironmentEntity::toDomain);
    }

    @Override
    public List<Environment> findAll() {
        return EnvironmentEntity.<EnvironmentEntity>findAll()
                .stream()
                .map(EnvironmentEntity::toDomain)
                .toList();
    }
}