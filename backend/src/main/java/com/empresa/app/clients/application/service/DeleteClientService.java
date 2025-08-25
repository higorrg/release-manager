package com.empresa.app.clients.application.service;

import com.empresa.app.clients.application.port.in.DeleteClientUseCase;
import com.empresa.app.clients.application.port.out.ClientRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class DeleteClientService implements DeleteClientUseCase {
    
    private final ClientRepository clientRepository;
    
    @Inject
    public DeleteClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }
    
    @Override
    public void deleteClient(DeleteClientCommand command) {
        // Check if client exists
        if (!clientRepository.findById(command.getClientId()).isPresent()) {
            throw new IllegalArgumentException("Client not found with id: " + command.id());
        }
        
        // Delete the client
        clientRepository.deleteById(command.getClientId());
    }
}