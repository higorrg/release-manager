package com.releasemanager.adapter.out.persistence;

import com.releasemanager.application.port.out.ReleaseRepository;
import com.releasemanager.domain.model.Environment;
import com.releasemanager.domain.model.Release;
import com.releasemanager.domain.model.ReleaseClient;
import com.releasemanager.domain.model.ReleaseId;
import com.releasemanager.domain.model.ReleaseStatus;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class ReleaseJpa implements ReleaseRepository, io.quarkus.hibernate.orm.panache.PanacheRepositoryBase<ReleaseEntity, UUID> {

    private static final Logger LOG = Logger.getLogger(ReleaseJpa.class);

    @Override
    @Transactional
    public Release save(Release release) {
        ReleaseEntity entity = toEntity(release);
        persist(entity);
        return toDomain(entity);
    }

    @Override
    public Optional<Release> findById(ReleaseId id) {
        return find("id", id.value()).firstResultOptional().map(this::toDomain);
    }

    @Override
    @Transactional
    public void updateStatus(ReleaseId id, ReleaseStatus status) {
        find("id", id.value()).firstResultOptional().ifPresent(e -> e.status = status);
    }

    @Override
    @Transactional
    public void addClient(ReleaseId id, ReleaseClient client) {
        find("id", id.value()).firstResultOptional().ifPresent(e -> {
            ReleaseClientEntity ce = new ReleaseClientEntity();
            ce.clientCode = client.clientCode();
            ce.environment = client.environment();
            ce.release = e;
            e.clients.add(ce);
        });
    }

    @Override
    public List<Release> findAvailableByClientAndEnvironment(String clientCode, Environment environment) {
        return list("SELECT rc.release FROM ReleaseClientEntity rc WHERE rc.clientCode = ?1 AND rc.environment = ?2", clientCode, environment)
            .stream().map(this::toDomain).collect(Collectors.toList());
    }

    private ReleaseEntity toEntity(Release release) {
        ReleaseEntity entity = new ReleaseEntity();
        entity.id = release.id().value();
        entity.productName = release.productName();
        entity.version = release.version();
        entity.status = release.status();
        return entity;
    }

    private Release toDomain(ReleaseEntity entity) {
        return new Release(new ReleaseId(entity.id), entity.productName, entity.version, entity.status,
                entity.clients.stream().map(c -> new ReleaseClient(c.clientCode, c.environment)).collect(Collectors.toSet()));
    }
}
