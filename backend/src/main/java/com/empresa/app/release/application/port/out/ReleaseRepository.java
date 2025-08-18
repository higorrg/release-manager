package com.empresa.app.release.application.port.out;

import com.empresa.app.release.domain.model.Release;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReleaseRepository {
    
    /**
     * Salva uma release
     */
    Release save(Release release);
    
    /**
     * Busca uma release por ID
     */
    Optional<Release> findById(UUID id);
    
    /**
     * Busca uma release por produto e versão
     */
    Optional<Release> findByProductIdAndVersion(UUID productId, String version);
    
    /**
     * Lista todas as releases de um produto
     */
    List<Release> findByProductId(UUID productId);
    
    /**
     * Lista releases por produto e status
     */
    List<Release> findByProductIdAndStatus(UUID productId, List<String> statuses);
    
    /**
     * Verifica se existe uma release com a versão especificada
     */
    boolean existsByProductIdAndVersion(UUID productId, String version);
    
    /**
     * Lista todas as releases
     */
    List<Release> findAll();
    
    /**
     * Busca uma release por nome do produto e versão
     */
    Optional<Release> findByProductNameAndVersion(String productName, String version);
}