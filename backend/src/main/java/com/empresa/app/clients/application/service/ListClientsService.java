package com.empresa.app.clients.application.service;

import com.empresa.app.clients.application.port.in.ListClientsUseCase;
import com.empresa.app.clients.application.port.out.ClientRepository;
import com.empresa.app.clients.domain.model.Client;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class ListClientsService implements ListClientsUseCase {
    
    private final ClientRepository clientRepository;
    
    @Inject
    public ListClientsService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }
    
    @Override
    public List<Client> listAllClients() {
        return clientRepository.findAll();
    }
    
    @Override
    public List<Client> listActiveClients() {
        return clientRepository.findByActive(true);
    }
    
    @Override
    public List<Client> listInactiveClients() {
        return clientRepository.findByActive(false);
    }
}