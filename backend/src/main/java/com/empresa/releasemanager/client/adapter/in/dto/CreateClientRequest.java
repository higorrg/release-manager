package com.empresa.releasemanager.client.adapter.in.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateClientRequest(
    @NotBlank(message = "Client code is required")
    String clientCode,
    
    @NotBlank(message = "Company name is required")
    String companyName,
    
    @Email(message = "Invalid email format")
    String contactEmail,
    
    String contactPhone,
    Boolean isBetaPartner,
    String notes
) {}