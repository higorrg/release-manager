package com.empresa.app.clients.application.port.in;

import com.empresa.app.clients.domain.model.Client;
import com.empresa.app.clients.domain.model.ClientId;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public interface UpdateClientUseCase {
    
    Client updateClient(UpdateClientCommand command);
    
    record UpdateClientCommand(
        @NotBlank String id,
        @NotBlank String name,
        boolean active
    ) {
        public ClientId getClientId() {
            return new ClientId(UUID.fromString(id));
        }
    }
}