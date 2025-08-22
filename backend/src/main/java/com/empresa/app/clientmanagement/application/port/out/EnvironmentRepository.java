package com.empresa.app.clientmanagement.application.port.out;

import com.empresa.app.clientmanagement.domain.model.Environment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnvironmentRepository {
    
    /**
     * Salva um ambiente
     */
    Environment save(Environment environment);
    
    /**
     * Busca um ambiente por ID
     */
    Optional<Environment> findById(UUID id);
    
    /**
     * Busca um ambiente por nome
     */
    Optional<Environment> findByName(String name);
    
    /**
     * Lista todos os ambientes
     */
    List<Environment> findAll();
}