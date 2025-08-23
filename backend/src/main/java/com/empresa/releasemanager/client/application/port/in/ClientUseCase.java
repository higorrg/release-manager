package com.empresa.releasemanager.client.application.port.in;

import com.empresa.releasemanager.client.domain.model.Client;

import java.util.List;
import java.util.Optional;

public interface ClientUseCase {
    
    Client createClient(CreateClientCommand command);
    
    void updateClient(UpdateClientCommand command);
    
    void deactivateClient(String clientCode);
    
    void activateClient(String clientCode);
    
    Optional<Client> findClientByCode(String clientCode);
    
    List<Client> findAllActiveClients();
    
    List<Client> findAllClients();
    
    List<Client> findBetaPartners();

    record CreateClientCommand(
        String clientCode,
        String companyName,
        String contactEmail,
        String contactPhone,
        Boolean isBetaPartner,
        String notes
    ) {}

    record UpdateClientCommand(
        String clientCode,
        String companyName,
        String contactEmail,
        String contactPhone,
        Boolean isBetaPartner,
        String notes
    ) {}
}