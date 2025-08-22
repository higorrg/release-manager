package com.empresa.app.releasemanagement.adapter.in.web;

import com.empresa.app.releasemanagement.adapter.in.dto.AvailableVersionResponse;
import com.empresa.app.releasemanagement.application.port.in.ReleaseUseCase;
import com.empresa.app.releasemanagement.domain.model.Release;
import com.empresa.app.product.application.port.out.ProductRepository;
import com.empresa.app.product.domain.model.Product;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

@Path("/api/v1/versions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Version Management", description = "Operações de consulta de versões disponíveis")
@RolesAllowed({"user", "admin"})
public class VersionController {

    @Inject
    ReleaseUseCase releaseUseCase;
    
    @Inject
    ProductRepository productRepository;

    @GET
    @Path("/available")
    @Operation(summary = "Listar versões disponíveis", description = "Lista versões disponíveis para um cliente em um ambiente específico. A release deve estar no status CONTROLADA ou DISPONÍVEL")
    public Response getAvailableVersions(@QueryParam("clientCode") String clientCode,
                                       @QueryParam("environment") String environment) {
        try {
            if (clientCode == null || clientCode.trim().isEmpty()) {
                throw new IllegalArgumentException("Client code is required");
            }
            
            if (environment == null || environment.trim().isEmpty()) {
                throw new IllegalArgumentException("Environment is required");
            }

            List<Release> availableReleases = releaseUseCase.findAvailableVersions(clientCode, environment);
            
            List<AvailableVersionResponse> response = availableReleases.stream()
                .map(release -> {
                    Product product = productRepository.findById(release.getProductId()).orElse(null);
                    return AvailableVersionResponse.from(release, product);
                })
                .collect(Collectors.toList());
                
            return Response.ok(response).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar versões disponíveis: " + e.getMessage(), e);
        }
    }
}