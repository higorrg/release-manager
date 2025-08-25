package com.empresa.app.clients.application.service;

import com.empresa.app.clients.application.port.in.GetClientUseCase;
import com.empresa.app.clients.application.port.out.ClientRepository;
import com.empresa.app.clients.domain.model.Client;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class GetClientService implements GetClientUseCase {
    
    private final ClientRepository clientRepository;
    
    @Inject
    public GetClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }
    
    @Override
    public Client getClientById(GetClientByIdQuery query) {
        return clientRepository.findById(query.getClientId())
            .orElseThrow(() -> new IllegalArgumentException("Client not found with id: " + query.id()));
    }
    
    @Override
    public Client getClientByCode(GetClientByCodeQuery query) {
        return clientRepository.findByCode(query.getClientCode())
            .orElseThrow(() -> new IllegalArgumentException("Client not found with code: " + query.code()));
    }
}