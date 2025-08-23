package com.empresa.releasemanager.release.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "release_client_environments", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"release_id", "client_code", "environment"}))
public class ReleaseClientEnvironment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "release_id", nullable = false)
    private Release release;

    @NotBlank
    @Column(name = "client_code", nullable = false)
    private String clientCode;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "environment", nullable = false)
    private Environment environment;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public ReleaseClientEnvironment() {}

    public ReleaseClientEnvironment(Release release, String clientCode, Environment environment) {
        this.release = release;
        this.clientCode = clientCode;
        this.environment = environment;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Release getRelease() {
        return release;
    }

    public void setRelease(Release release) {
        this.release = release;
    }

    public String getClientCode() {
        return clientCode;
    }

    public void setClientCode(String clientCode) {
        this.clientCode = clientCode;
    }

    public Environment getEnvironment() {
        return environment;
    }

    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReleaseClientEnvironment that = (ReleaseClientEnvironment) o;
        return Objects.equals(release, that.release) &&
               Objects.equals(clientCode, that.clientCode) &&
               environment == that.environment;
    }

    @Override
    public int hashCode() {
        return Objects.hash(release, clientCode, environment);
    }

    @Override
    public String toString() {
        return "ReleaseClientEnvironment{" +
                "id=" + id +
                ", clientCode='" + clientCode + '\'' +
                ", environment=" + environment +
                '}';
    }
}