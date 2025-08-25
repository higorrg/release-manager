package com.empresa.app.clients.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;

public class Client {
    
    private final ClientId id;
    private final ClientCode code;
    private final String name;
    private final LocalDateTime createdAt;
    private boolean active;
    
    public Client(ClientId id, ClientCode code, String name, LocalDateTime createdAt) {
        this.id = Objects.requireNonNull(id, "ClientId cannot be null");
        this.code = Objects.requireNonNull(code, "ClientCode cannot be null");
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.createdAt = Objects.requireNonNull(createdAt, "CreatedAt cannot be null");
        this.active = true;
    }
    
    public static Client create(ClientCode code, String name) {
        return new Client(
            ClientId.generate(),
            code,
            name,
            LocalDateTime.now()
        );
    }
    
    public void deactivate() {
        this.active = false;
    }
    
    public void activate() {
        this.active = true;
    }
    
    public ClientId getId() {
        return id;
    }
    
    public ClientCode getCode() {
        return code;
    }
    
    public String getName() {
        return name;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public boolean isActive() {
        return active;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Client client)) return false;
        return Objects.equals(id, client.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}