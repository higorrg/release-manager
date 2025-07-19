package br.com.releasemanager.release.application.port.out;

import br.com.releasemanager.release.domain.model.Environment;
import br.com.releasemanager.release.domain.model.Release;
import br.com.releasemanager.release.domain.model.Version;

import java.util.List;
import java.util.Optional;

public interface ReleaseRepository {
    
    Release save(Release release);
    
    Optional<Release> findById(Long id);
    
    Optional<Release> findByProductNameAndVersion(String productName, Version version);
    
    List<Release> findByProductName(String productName);
    
    List<Release> findAvailableForClientAndEnvironment(String clientCode, Environment environment, String productName);
    
    List<Release> findAll();
    
    void deleteById(Long id);
    
    boolean existsByProductNameAndVersion(String productName, Version version);
}