package com.empresa.app.authentication.domain.model;

import com.empresa.app.shared.domain.UserRole;

import java.time.LocalDateTime;
import java.util.Objects;

public class User {
    
    private final UserId id;
    private final Email email;
    private final String hashedPassword;
    private final UserRole role;
    private final LocalDateTime createdAt;
    private boolean active;
    
    public User(UserId id, Email email, String hashedPassword, UserRole role, LocalDateTime createdAt) {
        this.id = Objects.requireNonNull(id, "UserId cannot be null");
        this.email = Objects.requireNonNull(email, "Email cannot be null");
        this.hashedPassword = Objects.requireNonNull(hashedPassword, "HashedPassword cannot be null");
        this.role = Objects.requireNonNull(role, "UserRole cannot be null");
        this.createdAt = Objects.requireNonNull(createdAt, "CreatedAt cannot be null");
        this.active = true;
    }
    
    public static User create(Email email, String hashedPassword, UserRole role) {
        return new User(
            UserId.generate(),
            email,
            hashedPassword,
            role,
            LocalDateTime.now()
        );
    }
    
    public void deactivate() {
        this.active = false;
    }
    
    public void activate() {
        this.active = true;
    }
    
    public UserId getId() {
        return id;
    }
    
    public Email getEmail() {
        return email;
    }
    
    public String getHashedPassword() {
        return hashedPassword;
    }
    
    public UserRole getRole() {
        return role;
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
        if (!(o instanceof User user)) return false;
        return Objects.equals(id, user.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}