package com.empresa.app.clients.application.service;

import com.empresa.app.clients.application.port.in.CreateClientUseCase;
import com.empresa.app.clients.application.port.out.ClientRepository;
import com.empresa.app.clients.domain.model.Client;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class CreateClientService implements CreateClientUseCase {
    
    private final ClientRepository clientRepository;
    
    @Inject
    public CreateClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }
    
    @Override
    public Client createClient(CreateClientCommand command) {
        // Check if client code already exists
        if (clientRepository.existsByCode(command.getClientCode())) {
            throw new IllegalArgumentException("Client with code '" + command.code() + "' already exists");
        }
        
        // Create new client
        Client client = Client.create(command.getClientCode(), command.name());
        
        // Save and return
        return clientRepository.save(client);
    }
}