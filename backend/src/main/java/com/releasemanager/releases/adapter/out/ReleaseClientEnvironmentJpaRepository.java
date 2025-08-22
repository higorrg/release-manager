package com.releasemanager.releases.adapter.out;

import com.releasemanager.releases.application.port.out.ReleaseClientEnvironmentRepository;
import com.releasemanager.releases.domain.model.Environment;
import com.releasemanager.releases.domain.model.ReleaseClientEnvironment;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ReleaseClientEnvironmentJpaRepository implements ReleaseClientEnvironmentRepository, 
                                                              PanacheRepository<ReleaseClientEnvironment> {

    @Override
    public ReleaseClientEnvironment save(ReleaseClientEnvironment releaseClientEnvironment) {
        persist(releaseClientEnvironment);
        return releaseClientEnvironment;
    }

    @Override
    public Optional<ReleaseClientEnvironment> findByReleaseIdAndClientCodeAndEnvironment(
            Long releaseId, String clientCode, Environment environment) {
        return find("release.id = ?1 and client.code = ?2 and environment = ?3", 
                   releaseId, clientCode, environment)
            .firstResultOptional();
    }

    @Override
    public List<ReleaseClientEnvironment> findByReleaseId(Long releaseId) {
        return list("release.id", releaseId);
    }

    @Override
    public List<ReleaseClientEnvironment> findByClientCodeAndEnvironment(String clientCode, Environment environment) {
        return list("client.code = ?1 and environment = ?2", clientCode, environment);
    }

    @Override
    public void delete(ReleaseClientEnvironment releaseClientEnvironment) {
        delete(releaseClientEnvironment);
    }
}