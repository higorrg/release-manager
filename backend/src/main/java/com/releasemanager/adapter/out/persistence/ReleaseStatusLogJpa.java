package com.releasemanager.adapter.out.persistence;

import com.releasemanager.application.port.out.ReleaseStatusLogRepository;
import com.releasemanager.domain.model.ReleaseStatusLog;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class ReleaseStatusLogJpa implements ReleaseStatusLogRepository, io.quarkus.hibernate.orm.panache.PanacheRepositoryBase<ReleaseStatusLogEntity, UUID> {

    @Override
    @Transactional
    public void log(ReleaseStatusLog log) {
        ReleaseStatusLogEntity entity = new ReleaseStatusLogEntity();
        entity.releaseId = log.releaseId().value();
        entity.status = log.status();
        entity.changedAt = log.changedAt();
        persist(entity);
    }
}
