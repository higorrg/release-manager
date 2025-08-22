package com.releasemanager.clients.application.port.out;

import com.releasemanager.clients.domain.model.Client;
import java.util.List;
import java.util.Optional;

public interface ClientRepository {
    
    Client save(Client client);
    Optional<Client> findByIdOptional(Long id);
    Optional<Client> findByCode(String code);
    List<Client> getAllClients();
    List<Client> findAllActive();
}