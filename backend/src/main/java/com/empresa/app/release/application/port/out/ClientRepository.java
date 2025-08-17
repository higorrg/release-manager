package com.empresa.app.release.application.port.out;

import com.empresa.app.release.domain.model.Client;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClientRepository {
    
    /**
     * Salva um cliente
     */
    Client save(Client client);
    
    /**
     * Busca um cliente por ID
     */
    Optional<Client> findById(UUID id);
    
    /**
     * Busca um cliente por código
     */
    Optional<Client> findByClientCode(String clientCode);
    
    /**
     * Lista todos os clientes
     */
    List<Client> findAll();
    
    /**
     * Verifica se existe um cliente com o código especificado
     */
    boolean existsByClientCode(String clientCode);
}