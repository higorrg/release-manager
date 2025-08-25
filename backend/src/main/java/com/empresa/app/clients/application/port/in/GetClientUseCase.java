package com.empresa.app.clients.application.port.in;

import com.empresa.app.clients.domain.model.Client;
import com.empresa.app.clients.domain.model.ClientCode;
import com.empresa.app.clients.domain.model.ClientId;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public interface GetClientUseCase {
    
    Client getClientById(GetClientByIdQuery query);
    
    Client getClientByCode(GetClientByCodeQuery query);
    
    record GetClientByIdQuery(
        @NotBlank String id
    ) {
        public ClientId getClientId() {
            return new ClientId(UUID.fromString(id));
        }
    }
    
    record GetClientByCodeQuery(
        @NotBlank String code
    ) {
        public ClientCode getClientCode() {
            return new ClientCode(code);
        }
    }
}