package com.releasemanager.clients.application.service;

import com.releasemanager.clients.application.port.in.ManageClientsUseCase;
import com.releasemanager.clients.application.port.out.ClientRepository;
import com.releasemanager.clients.domain.model.Client;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ClientService implements ManageClientsUseCase {

    @Inject
    ClientRepository clientRepository;

    @Override
    @Transactional
    public ClientInfo createClient(CreateClientCommand command) {
        var existingClient = clientRepository.findByCode(command.code());
        if (existingClient.isPresent()) {
            throw new IllegalArgumentException("Cliente com código '" + command.code() + "' já existe");
        }

        var client = new Client(command.code(), command.name());
        client = clientRepository.save(client);
        return mapToClientInfo(client);
    }

    @Override
    @Transactional
    public ClientInfo updateClient(UpdateClientCommand command) {
        var client = clientRepository.findByIdOptional(command.id())
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        client.name = command.name();
        client.active = command.active();
        client = clientRepository.save(client);
        
        return mapToClientInfo(client);
    }

    @Override
    public List<ClientInfo> getAllClients() {
        return clientRepository.getAllClients().stream()
            .map(this::mapToClientInfo)
            .toList();
    }

    @Override
    public List<ClientInfo> getActiveClients() {
        return clientRepository.findAllActive().stream()
            .map(this::mapToClientInfo)
            .toList();
    }

    @Override
    public ClientInfo getClientById(Long id) {
        var client = clientRepository.findByIdOptional(id)
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        return mapToClientInfo(client);
    }

    @Override
    public ClientInfo getClientByCode(String code) {
        var client = clientRepository.findByCode(code)
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        return mapToClientInfo(client);
    }

    private ClientInfo mapToClientInfo(Client client) {
        return new ClientInfo(
            client.id,
            client.code,
            client.name,
            client.active,
            client.createdAt,
            client.updatedAt
        );
    }
}