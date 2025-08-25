package com.empresa.app.clients.application.port.in;

import com.empresa.app.clients.domain.model.Client;
import com.empresa.app.clients.domain.model.ClientCode;
import jakarta.validation.constraints.NotBlank;

public interface CreateClientUseCase {
    
    Client createClient(CreateClientCommand command);
    
    record CreateClientCommand(
        @NotBlank String code,
        @NotBlank String name
    ) {
        public ClientCode getClientCode() {
            return new ClientCode(code);
        }
    }
}