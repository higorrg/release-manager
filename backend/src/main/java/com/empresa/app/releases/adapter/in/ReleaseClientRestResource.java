package com.empresa.app.releases.adapter.in;

import com.empresa.app.clients.domain.model.ClientCode;
import com.empresa.app.releases.application.port.in.AddClientToReleaseUseCase;
import com.empresa.app.releases.application.port.in.GetReleaseClientsUseCase;
import com.empresa.app.releases.application.port.in.RemoveClientFromReleaseUseCase;
import com.empresa.app.releases.domain.model.ReleaseClientEnvironment;
import com.empresa.app.releases.domain.model.ReleaseId;
import com.empresa.app.shared.domain.Environment;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Path("/api/v1/releases/{releaseId}/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Release Clients", description = "Release client management operations")
public class ReleaseClientRestResource {
    
    private final AddClientToReleaseUseCase addClientToReleaseUseCase;
    private final RemoveClientFromReleaseUseCase removeClientFromReleaseUseCase;
    private final GetReleaseClientsUseCase getReleaseClientsUseCase;
    
    @Inject
    public ReleaseClientRestResource(AddClientToReleaseUseCase addClientToReleaseUseCase,
                                    RemoveClientFromReleaseUseCase removeClientFromReleaseUseCase,
                                    GetReleaseClientsUseCase getReleaseClientsUseCase) {
        this.addClientToReleaseUseCase = Objects.requireNonNull(addClientToReleaseUseCase);
        this.removeClientFromReleaseUseCase = Objects.requireNonNull(removeClientFromReleaseUseCase);
        this.getReleaseClientsUseCase = Objects.requireNonNull(getReleaseClientsUseCase);
    }
    
    @GET
    @Operation(summary = "Get release clients")
    public Response getReleaseClients(@PathParam("releaseId") @Parameter(description = "Release ID") String releaseId) {
        try {
            var id = new ReleaseId(UUID.fromString(releaseId));
            
            var clients = getReleaseClientsUseCase.getReleaseClients(id);
            
            var response = clients.stream()
                    .map(ReleaseClientResponse::fromDomain)
                    .collect(Collectors.toList());
            
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Invalid release ID format")).build();
        }
    }
    
    @POST
    @Operation(summary = "Add client to release")
    public Response addClient(@PathParam("releaseId") @Parameter(description = "Release ID") String releaseId,
                             @Valid AddClientRequest request) {
        try {
            var command = new AddClientToReleaseUseCase.AddClientCommand(
                    new ReleaseId(UUID.fromString(releaseId)),
                    new ClientCode(request.clientCode),
                    Environment.valueOf(request.environment)
            );
            
            var releaseClient = addClientToReleaseUseCase.addClientToRelease(command);
            
            var response = ReleaseClientResponse.fromDomain(releaseClient);
            
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    @DELETE
    @Path("/{clientCode}/environments/{environment}")
    @Operation(summary = "Remove client from release")
    public Response removeClient(@PathParam("releaseId") @Parameter(description = "Release ID") String releaseId,
                                @PathParam("clientCode") @Parameter(description = "Client code") String clientCode,
                                @PathParam("environment") @Parameter(description = "Environment") String environment) {
        try {
            var command = new RemoveClientFromReleaseUseCase.RemoveClientCommand(
                    new ReleaseId(UUID.fromString(releaseId)),
                    new ClientCode(clientCode),
                    Environment.valueOf(environment)
            );
            
            removeClientFromReleaseUseCase.removeClientFromRelease(command);
            
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    // DTOs
    public static record AddClientRequest(
            @NotBlank String clientCode,
            @NotBlank String environment
    ) {}
    
    public static record ReleaseClientResponse(
            String id,
            String releaseId,
            String clientCode,
            String environment,
            String environmentDisplayName,
            LocalDateTime createdAt
    ) {
        public static ReleaseClientResponse fromDomain(ReleaseClientEnvironment releaseClient) {
            return new ReleaseClientResponse(
                    releaseClient.getId().toString(),
                    releaseClient.getReleaseId().toString(),
                    releaseClient.getClientCode().value(),
                    releaseClient.getEnvironment().name(),
                    releaseClient.getEnvironment().getDisplayName(),
                    releaseClient.getCreatedAt()
            );
        }
    }
    
    public static record ErrorResponse(String message) {}
}

@Path("/api/v1/clients/{clientCode}/environments/{environment}/releases")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Client Releases", description = "Client release operations")
class ClientReleaseRestResource {
    
    private final GetReleaseClientsUseCase getReleaseClientsUseCase;
    
    @Inject
    public ClientReleaseRestResource(GetReleaseClientsUseCase getReleaseClientsUseCase) {
        this.getReleaseClientsUseCase = Objects.requireNonNull(getReleaseClientsUseCase);
    }
    
    @GET
    @Operation(summary = "Get client releases for environment")
    public Response getClientReleases(@PathParam("clientCode") @Parameter(description = "Client code") String clientCode,
                                     @PathParam("environment") @Parameter(description = "Environment") String environment) {
        try {
            var releases = getReleaseClientsUseCase.getClientReleases(
                    new ClientCode(clientCode),
                    Environment.valueOf(environment)
            );
            
            var response = releases.stream()
                    .map(ReleaseClientRestResource.ReleaseClientResponse::fromDomain)
                    .collect(Collectors.toList());
            
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ReleaseClientRestResource.ErrorResponse(e.getMessage())).build();
        }
    }
}