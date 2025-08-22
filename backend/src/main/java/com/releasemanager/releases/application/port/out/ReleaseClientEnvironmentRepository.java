package com.releasemanager.releases.application.port.out;

import com.releasemanager.releases.domain.model.Environment;
import com.releasemanager.releases.domain.model.ReleaseClientEnvironment;
import java.util.List;
import java.util.Optional;

public interface ReleaseClientEnvironmentRepository {
    
    ReleaseClientEnvironment save(ReleaseClientEnvironment releaseClientEnvironment);
    Optional<ReleaseClientEnvironment> findByReleaseIdAndClientCodeAndEnvironment(
        Long releaseId, String clientCode, Environment environment);
    List<ReleaseClientEnvironment> findByReleaseId(Long releaseId);
    List<ReleaseClientEnvironment> findByClientCodeAndEnvironment(String clientCode, Environment environment);
    void delete(ReleaseClientEnvironment releaseClientEnvironment);
}