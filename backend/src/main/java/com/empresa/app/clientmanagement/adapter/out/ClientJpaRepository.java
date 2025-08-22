package com.empresa.app.clientmanagement.adapter.out;

import com.empresa.app.clientmanagement.application.port.out.ClientRepository;
import com.empresa.app.clientmanagement.domain.model.Client;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ClientJpaRepository implements ClientRepository {

    @Override
    @Transactional
    public Client save(Client client) {
        var entity = ClientEntity.findById(client.getId());
        if (entity != null) {
            var existingEntity = (ClientEntity) entity;
            existingEntity.clientCode = client.getClientCode();
            existingEntity.name = client.getName();
            existingEntity.description = client.getDescription();
            existingEntity.persist();
            return existingEntity.toDomain();
        } else {
            var newEntity = ClientEntity.from(client);
            newEntity.persist();
            return newEntity.toDomain();
        }
    }

    @Override
    public Optional<Client> findById(UUID id) {
        return ClientEntity.<ClientEntity>findByIdOptional(id)
                .map(ClientEntity::toDomain);
    }

    @Override
    public Optional<Client> findByClientCode(String clientCode) {
        return ClientEntity.<ClientEntity>find("clientCode = ?1", clientCode)
                .firstResultOptional()
                .map(ClientEntity::toDomain);
    }

    @Override
    public List<Client> findAll() {
        return ClientEntity.<ClientEntity>findAll()
                .stream()
                .map(ClientEntity::toDomain)
                .toList();
    }

    @Override
    public boolean existsByClientCode(String clientCode) {
        return ClientEntity.count("clientCode = ?1", clientCode) > 0;
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        ClientEntity.deleteById(id);
    }
}