package com.releasemanager.clients.adapter.out;

import com.releasemanager.clients.application.port.out.ClientRepository;
import com.releasemanager.clients.domain.model.Client;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ClientJpaRepository implements ClientRepository, PanacheRepository<Client> {

    @Override
    public Client save(Client client) {
        persist(client);
        return client;
    }

    @Override
    public Optional<Client> findByIdOptional(Long id) {
        return Optional.ofNullable(PanacheRepository.super.findById(id));
    }

    @Override
    public Optional<Client> findByCode(String code) {
        return find("code", code).firstResultOptional();
    }

    @Override
    public List<Client> getAllClients() {
        return listAll();
    }

    @Override
    public List<Client> findAllActive() {
        return list("active", true);
    }
}