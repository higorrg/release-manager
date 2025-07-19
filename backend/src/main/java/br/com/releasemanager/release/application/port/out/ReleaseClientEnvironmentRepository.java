package br.com.releasemanager.release.application.port.out;

import br.com.releasemanager.release.domain.model.Environment;
import br.com.releasemanager.release.domain.model.ReleaseClientEnvironment;

import java.util.List;
import java.util.Optional;

public interface ReleaseClientEnvironmentRepository {
    
    ReleaseClientEnvironment save(ReleaseClientEnvironment clientEnvironment);
    
    Optional<ReleaseClientEnvironment> findByReleaseIdAndClientCodeAndEnvironment(
        Long releaseId, String clientCode, Environment environment);
    
    List<ReleaseClientEnvironment> findByReleaseId(Long releaseId);
    
    List<ReleaseClientEnvironment> findByClientCodeAndEnvironment(String clientCode, Environment environment);
    
    void deleteByReleaseIdAndClientCodeAndEnvironment(Long releaseId, String clientCode, Environment environment);
    
    boolean existsByReleaseIdAndClientCodeAndEnvironment(Long releaseId, String clientCode, Environment environment);
}