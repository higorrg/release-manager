package com.empresa.releasemanager.client.application.service;

import com.empresa.releasemanager.client.application.port.in.ClientUseCase;
import com.empresa.releasemanager.client.application.port.out.ClientRepository;
import com.empresa.releasemanager.client.domain.model.Client;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
@Transactional
public class ClientService implements ClientUseCase {

    @Inject
    ClientRepository clientRepository;

    @Override
    public Client createClient(CreateClientCommand command) {
        if (clientRepository.existsByClientCode(command.clientCode())) {
            throw new DuplicateClientCodeException("Client code already exists: " + command.clientCode());
        }

        Client client = new Client(command.clientCode(), command.companyName());
        client.setContactEmail(command.contactEmail());
        client.setContactPhone(command.contactPhone());
        client.setIsBetaPartner(command.isBetaPartner() != null ? command.isBetaPartner() : false);
        client.setNotes(command.notes());

        return clientRepository.save(client);
    }

    @Override
    public void updateClient(UpdateClientCommand command) {
        Client client = clientRepository.findByClientCode(command.clientCode())
            .orElseThrow(() -> new ClientNotFoundException("Client not found: " + command.clientCode()));

        client.setCompanyName(command.companyName());
        client.setContactEmail(command.contactEmail());
        client.setContactPhone(command.contactPhone());
        client.setIsBetaPartner(command.isBetaPartner() != null ? command.isBetaPartner() : false);
        client.setNotes(command.notes());

        clientRepository.save(client);
    }

    @Override
    public void deactivateClient(String clientCode) {
        Client client = clientRepository.findByClientCode(clientCode)
            .orElseThrow(() -> new ClientNotFoundException("Client not found: " + clientCode));

        client.deactivate();
        clientRepository.save(client);
    }

    @Override
    public void activateClient(String clientCode) {
        Client client = clientRepository.findByClientCode(clientCode)
            .orElseThrow(() -> new ClientNotFoundException("Client not found: " + clientCode));

        client.activate();
        clientRepository.save(client);
    }

    @Override
    public Optional<Client> findClientByCode(String clientCode) {
        return clientRepository.findByClientCode(clientCode);
    }

    @Override
    public List<Client> findAllActiveClients() {
        return clientRepository.findAllActive();
    }

    @Override
    public List<Client> findAllClients() {
        return clientRepository.findAllClients();
    }

    @Override
    public List<Client> findBetaPartners() {
        return clientRepository.findBetaPartners();
    }

    public static class ClientNotFoundException extends RuntimeException {
        public ClientNotFoundException(String message) {
            super(message);
        }
    }

    public static class DuplicateClientCodeException extends RuntimeException {
        public DuplicateClientCodeException(String message) {
            super(message);
        }
    }
}