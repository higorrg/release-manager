package com.empresa.app.clients.application.port.in;

import com.empresa.app.clients.domain.model.Client;

import java.util.List;

public interface ListClientsUseCase {
    
    List<Client> listAllClients();
    
    List<Client> listActiveClients();
    
    List<Client> listInactiveClients();
}