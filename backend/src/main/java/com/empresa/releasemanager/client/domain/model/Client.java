package com.empresa.releasemanager.client.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "clients", uniqueConstraints = {
    @UniqueConstraint(columnNames = "client_code")
})
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "client_code", nullable = false, unique = true)
    private String clientCode;

    @NotBlank
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_beta_partner", nullable = false)
    private Boolean isBetaPartner = false;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public Client() {}

    public Client(String clientCode, String companyName) {
        this.clientCode = clientCode;
        this.companyName = companyName;
    }

    // Business methods
    public boolean canAccessBetaReleases() {
        return isActive && isBetaPartner;
    }

    public void deactivate() {
        this.isActive = false;
    }

    public void activate() {
        this.isActive = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClientCode() {
        return clientCode;
    }

    public void setClientCode(String clientCode) {
        this.clientCode = clientCode;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsBetaPartner() {
        return isBetaPartner;
    }

    public void setIsBetaPartner(Boolean isBetaPartner) {
        this.isBetaPartner = isBetaPartner;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Client client = (Client) o;
        return Objects.equals(clientCode, client.clientCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientCode);
    }

    @Override
    public String toString() {
        return "Client{" +
                "id=" + id +
                ", clientCode='" + clientCode + '\'' +
                ", companyName='" + companyName + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}