package com.releasemanager.clients.application.port.in;

import java.time.ZonedDateTime;
import java.util.List;

public interface ManageClientsUseCase {
    
    record CreateClientCommand(String code, String name) {}
    
    record UpdateClientCommand(Long id, String name, Boolean active) {}
    
    record ClientInfo(
        Long id,
        String code,
        String name,
        Boolean active,
        ZonedDateTime createdAt,
        ZonedDateTime updatedAt
    ) {}
    
    ClientInfo createClient(CreateClientCommand command);
    ClientInfo updateClient(UpdateClientCommand command);
    List<ClientInfo> getAllClients();
    List<ClientInfo> getActiveClients();
    ClientInfo getClientById(Long id);
    ClientInfo getClientByCode(String code);
}