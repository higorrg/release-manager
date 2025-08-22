package com.empresa.app.releasemanagement.adapter.in.web;

import com.empresa.app.releasemanagement.adapter.in.dto.AddControlledClientRequest;
import com.empresa.app.clientmanagement.adapter.in.dto.ClientResponse;
import com.empresa.app.releasemanagement.adapter.in.dto.ControlledClientDetailResponse;
import com.empresa.app.releasemanagement.adapter.in.dto.CreateReleaseRequest;
import com.empresa.app.releasemanagement.adapter.in.dto.ReleaseResponse;
import com.empresa.app.releasemanagement.adapter.in.dto.ReleaseStatusHistoryResponse;
import com.empresa.app.releasemanagement.adapter.in.dto.UpdatePackageInfoRequest;
import com.empresa.app.releasemanagement.adapter.in.dto.UpdatePrerequisitesRequest;
import com.empresa.app.releasemanagement.adapter.in.dto.UpdateReleaseNotesRequest;
import com.empresa.app.releasemanagement.adapter.in.dto.UpdateStatusRequest;
import com.empresa.app.releasemanagement.application.port.in.ReleaseUseCase;
import com.empresa.app.clientmanagement.application.port.in.ClientManagementUseCase;
import com.empresa.app.releasemanagement.application.port.in.ReleaseClientAssociationUseCase;
import com.empresa.app.product.application.port.out.ProductRepository;
import com.empresa.app.clientmanagement.domain.model.Client;
import com.empresa.app.clientmanagement.domain.model.Environment;
import com.empresa.app.product.domain.model.Product;
import com.empresa.app.releasemanagement.domain.model.Release;
import com.empresa.app.releasemanagement.domain.model.ReleaseClientEnvironment;
import com.empresa.app.releasemanagement.domain.model.ReleaseStatus;
import com.empresa.app.releasemanagement.domain.model.ReleaseStatusHistory;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Path("/api/v1/releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Release Management", description = "Operações de gerenciamento de releases")
@RolesAllowed({"user", "admin"})
public class ReleaseController {

    @Inject
    ReleaseUseCase releaseUseCase;
    
    @Inject
    ClientManagementUseCase clientManagementUseCase;
    
    @Inject
    ReleaseClientAssociationUseCase releaseClientAssociationUseCase;

    @Inject
    ProductRepository productRepository;

    @POST
    @Path("/pipeline")
    @Operation(summary = "Criar uma nova release", description = "Cria uma nova release a partir da pipeline")
    @RolesAllowed("admin")
    public Response createRelease(CreateReleaseRequest request) {
        try {
            var command = new ReleaseUseCase.CreateReleaseCommand(
                request.productName(),
                request.version()
            );
            
            Release release = releaseUseCase.createReleaseFromPipeline(command);
            ReleaseResponse response = mapToResponse(release);
            
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar release: " + e.getMessage(), e);
        }
    }

    @POST
    @Operation(summary = "Criar uma nova release via web", description = "Cria uma nova release a partir da interface web")
    @RolesAllowed("admin")
    public Response createReleaseFromWeb(CreateReleaseRequest request) {
        try {
            var command = new ReleaseUseCase.CreateReleaseCommand(
                request.productName(),
                request.version()
            );
            
            Release release = releaseUseCase.createReleaseFromWeb(command);
            ReleaseResponse response = mapToResponse(release);
            
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar release: " + e.getMessage(), e);
        }
    }

    @GET
    @Operation(summary = "Listar releases", description = "Lista todas as releases ou por produto")
    public Response listReleases(@QueryParam("productId") String productId) {
        try {
            List<Release> releases;
            
            if (productId != null && !productId.isEmpty()) {
                releases = releaseUseCase.findReleasesByProduct(UUID.fromString(productId));
            } else {
                releases = releaseUseCase.findAllReleases();
            }
            
            List<ReleaseResponse> response = releases.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
            return Response.ok(response).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar releases: " + e.getMessage(), e);
        }
    }

    @GET
    @Path("/{releaseId}")
    @Operation(summary = "Buscar release por ID", description = "Busca uma release específica por ID")
    public Response getRelease(@PathParam("releaseId") String releaseId) {
        try {
            UUID id = UUID.fromString(releaseId);
            return releaseUseCase.findReleaseById(id)
                .map(release -> Response.ok(mapToResponse(release)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar release: " + e.getMessage(), e);
        }
    }

    @PUT
    @Path("/{releaseId}/status")
    @Operation(summary = "Atualizar status da release", description = "Atualiza o status de uma release")
    @RolesAllowed("admin")
    public Response updateReleaseStatus(@PathParam("releaseId") String releaseId, 
                                      UpdateStatusRequest request) {
        try {
            UUID id = UUID.fromString(releaseId);
            var command = new ReleaseUseCase.UpdateReleaseStatusCommand(
                id,
                ReleaseStatus.valueOf(request.newStatus()),
                request.changedBy(),
                request.comments()
            );
            
            Release release = releaseUseCase.updateReleaseStatus(command);
            return Response.ok(mapToResponse(release)).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar status: " + e.getMessage(), e);
        }
    }

    @PUT
    @Path("/{releaseId}/release-notes")
    @Operation(summary = "Atualizar release notes", description = "Atualiza as release notes de uma release")
    @RolesAllowed("admin")
    public Response updateReleaseNotes(@PathParam("releaseId") String releaseId,
                                     UpdateReleaseNotesRequest request) {
        try {
            UUID id = UUID.fromString(releaseId);
            var command = new ReleaseUseCase.UpdateReleaseNotesCommand(
                id,
                request.releaseNotes()
            );
            
            Release release = releaseUseCase.updateReleaseNotes(command);
            return Response.ok(mapToResponse(release)).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar release notes: " + e.getMessage(), e);
        }
    }

    @PUT
    @Path("/{releaseId}/prerequisites")
    @Operation(summary = "Atualizar pré-requisitos", description = "Atualiza os pré-requisitos de uma release")
    @RolesAllowed("admin")
    public Response updatePrerequisites(@PathParam("releaseId") String releaseId,
                                      UpdatePrerequisitesRequest request) {
        try {
            UUID id = UUID.fromString(releaseId);
            var command = new ReleaseUseCase.UpdatePrerequisitesCommand(
                id,
                request.prerequisites()
            );
            
            Release release = releaseUseCase.updatePrerequisites(command);
            return Response.ok(mapToResponse(release)).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar pré-requisitos: " + e.getMessage(), e);
        }
    }

    @PUT
    @Path("/{releaseId}/package-info")
    @Operation(summary = "Atualizar informações de pacote", description = "Atualiza URL de download e caminho do pacote de uma release")
    @RolesAllowed("admin")
    public Response updatePackageInfo(@PathParam("releaseId") String releaseId,
                                    UpdatePackageInfoRequest request) {
        try {
            UUID id = UUID.fromString(releaseId);
            var command = new ReleaseUseCase.UpdatePackageInfoCommand(
                id,
                request.downloadUrl()
            );
            
            Release release = releaseUseCase.updatePackageInfo(command);
            return Response.ok(mapToResponse(release)).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar informações de pacote: " + e.getMessage(), e);
        }
    }

    @GET
    @Path("/{releaseId}/history")
    @Operation(summary = "Buscar histórico da release", description = "Busca o histórico de mudanças de status de uma release")
    public Response getReleaseHistory(@PathParam("releaseId") String releaseId) {
        try {
            UUID id = UUID.fromString(releaseId);
            List<ReleaseStatusHistory> history = releaseUseCase.findReleaseStatusHistory(id);
            
            List<ReleaseStatusHistoryResponse> response = history.stream()
                .map(this::mapToHistoryResponse)
                .collect(Collectors.toList());
                
            return Response.ok(response).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar histórico: " + e.getMessage(), e);
        }
    }

    @GET
    @Path("/clients")
    @Operation(summary = "Listar clientes", description = "Lista todos os clientes disponíveis")
    public Response getAllClients() {
        try {
            List<Client> clients = clientManagementUseCase.findAllClients();
            
            List<ClientResponse> response = clients.stream()
                .map(ClientResponse::from)
                .collect(Collectors.toList());
                
            return Response.ok(response).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar clientes: " + e.getMessage(), e);
        }
    }

    @GET
    @Path("/environments")
    @Operation(summary = "Listar ambientes", description = "Lista todos os ambientes disponíveis")
    public Response getAllEnvironments() {
        try {
            List<Environment> environments = clientManagementUseCase.findAllEnvironments();
            return Response.ok(environments).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar ambientes: " + e.getMessage(), e);
        }
    }

    @POST
    @Path("/{releaseId}/controlled-clients")
    @Operation(summary = "Adicionar cliente controlado", description = "Adiciona um cliente controlado a uma release")
    @RolesAllowed("admin")
    public Response addControlledClient(@PathParam("releaseId") String releaseId, 
                                      AddControlledClientRequest request) {
        try {
            UUID id = UUID.fromString(releaseId);
            var command = new ReleaseClientAssociationUseCase.AddControlledClientCommand(
                id, 
                request.clientCode(), 
                request.environment()
            );
            
            ReleaseClientEnvironment association = releaseClientAssociationUseCase.addControlledClient(command);
            
            // Return detailed response instead of basic association
            Client client = clientManagementUseCase.findClientById(association.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found: " + association.getClientId()));
            Environment environment = clientManagementUseCase.findAllEnvironments().stream()
                .filter(env -> env.getId().equals(association.getEnvironmentId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Environment not found: " + association.getEnvironmentId()));
            
            ControlledClientDetailResponse response = ControlledClientDetailResponse.from(association, client, environment);
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        } catch (IllegalStateException e) {
            return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao adicionar cliente controlado: " + e.getMessage(), e);
        }
    }

    @GET
    @Path("/{releaseId}/controlled-clients")
    @Operation(summary = "Listar clientes controlados", description = "Lista os clientes controlados de uma release")
    public Response getControlledClients(@PathParam("releaseId") String releaseId) {
        try {
            UUID id = UUID.fromString(releaseId);
            List<ReleaseClientEnvironment> controlledClients = releaseClientAssociationUseCase.findControlledClients(id);
            
            List<ControlledClientDetailResponse> response = controlledClients.stream()
                .map(rce -> {
                    Client client = clientManagementUseCase.findClientById(rce.getClientId())
                        .orElseThrow(() -> new RuntimeException("Client not found: " + rce.getClientId()));
                    Environment environment = clientManagementUseCase.findAllEnvironments().stream()
                        .filter(env -> env.getId().equals(rce.getEnvironmentId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Environment not found: " + rce.getEnvironmentId()));
                    return ControlledClientDetailResponse.from(rce, client, environment);
                })
                .collect(Collectors.toList());
            
            return Response.ok(response).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar clientes controlados: " + e.getMessage(), e);
        }
    }

    @DELETE
    @Path("/{releaseId}/controlled-clients/{clientId}/{environmentId}")
    @Operation(summary = "Remover cliente controlado", description = "Remove um cliente controlado de uma release")
    @RolesAllowed("admin")
    public Response removeControlledClient(@PathParam("releaseId") String releaseId,
                                         @PathParam("clientId") String clientId,
                                         @PathParam("environmentId") String environmentId) {
        try {
            UUID relId = UUID.fromString(releaseId);
            UUID cliId = UUID.fromString(clientId);
            UUID envId = UUID.fromString(environmentId);
            
            releaseClientAssociationUseCase.removeControlledClient(relId, cliId, envId);
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao remover cliente controlado: " + e.getMessage(), e);
        }
    }

    private ReleaseResponse mapToResponse(Release release) {
        Product product = productRepository.findById(release.getProductId()).orElse(null);
        return ReleaseResponse.from(release, product);
    }

    private ReleaseStatusHistoryResponse mapToHistoryResponse(ReleaseStatusHistory history) {
        return ReleaseStatusHistoryResponse.from(history);
    }
}
