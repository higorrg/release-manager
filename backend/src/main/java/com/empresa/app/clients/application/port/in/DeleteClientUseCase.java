package com.empresa.app.clients.application.port.in;

import com.empresa.app.clients.domain.model.ClientId;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public interface DeleteClientUseCase {
    
    void deleteClient(DeleteClientCommand command);
    
    record DeleteClientCommand(
        @NotBlank String id
    ) {
        public ClientId getClientId() {
            return new ClientId(UUID.fromString(id));
        }
    }
}