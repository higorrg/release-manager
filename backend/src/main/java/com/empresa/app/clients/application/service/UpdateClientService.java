package com.empresa.app.clients.application.service;

import com.empresa.app.clients.application.port.in.UpdateClientUseCase;
import com.empresa.app.clients.application.port.out.ClientRepository;
import com.empresa.app.clients.domain.model.Client;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class UpdateClientService implements UpdateClientUseCase {
    
    private final ClientRepository clientRepository;
    
    @Inject
    public UpdateClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }
    
    @Override
    public Client updateClient(UpdateClientCommand command) {
        // Find existing client
        Client client = clientRepository.findById(command.getClientId())
            .orElseThrow(() -> new IllegalArgumentException("Client not found with id: " + command.id()));
        
        // Update the client
        client.updateName(command.name());
        
        // Set active status
        if (command.active()) {
            client.activate();
        } else {
            client.deactivate();
        }
        
        // Save and return
        return clientRepository.save(client);
    }
}