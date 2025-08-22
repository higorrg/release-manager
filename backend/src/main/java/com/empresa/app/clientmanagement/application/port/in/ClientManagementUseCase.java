package com.empresa.app.clientmanagement.application.port.in;

import com.empresa.app.clientmanagement.domain.model.Client;
import com.empresa.app.clientmanagement.domain.model.Environment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClientManagementUseCase {
    
    /**
     * Lista todos os clientes disponíveis
     */
    List<Client> findAllClients();
    
    /**
     * Lista todos os ambientes disponíveis
     */
    List<Environment> findAllEnvironments();
    
    /**
     * Busca ou cria um cliente pelo código
     */
    Client findOrCreateClient(String clientCode);
    
    /**
     * Busca um cliente por ID
     */
    Optional<Client> findClientById(UUID clientId);
    
    /**
     * Cria um novo cliente
     */
    Client createClient(CreateClientCommand command);
    
    /**
     * Atualiza um cliente existente
     */
    Client updateClient(UpdateClientCommand command);
    
    /**
     * Exclui um cliente (apenas se não estiver em uso)
     */
    void deleteClient(UUID clientId);
    
    record CreateClientCommand(String clientCode, String name, String description) {}
    
    record UpdateClientCommand(UUID clientId, String name, String description) {}
}