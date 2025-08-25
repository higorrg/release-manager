package com.empresa.app.clients.adapter.in;

import com.empresa.app.clients.application.port.in.*;
import com.empresa.app.clients.domain.model.Client;
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
import java.util.stream.Collectors;

@Path("/api/v1/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Clients", description = "Client management operations")
public class ClientRestResource {
    
    private final ListClientsUseCase listClientsUseCase;
    private final CreateClientUseCase createClientUseCase;
    private final UpdateClientUseCase updateClientUseCase;
    private final DeleteClientUseCase deleteClientUseCase;
    private final GetClientUseCase getClientUseCase;
    
    @Inject
    public ClientRestResource(ListClientsUseCase listClientsUseCase,
                             CreateClientUseCase createClientUseCase,
                             UpdateClientUseCase updateClientUseCase,
                             DeleteClientUseCase deleteClientUseCase,
                             GetClientUseCase getClientUseCase) {
        this.listClientsUseCase = Objects.requireNonNull(listClientsUseCase);
        this.createClientUseCase = Objects.requireNonNull(createClientUseCase);
        this.updateClientUseCase = Objects.requireNonNull(updateClientUseCase);
        this.deleteClientUseCase = Objects.requireNonNull(deleteClientUseCase);
        this.getClientUseCase = Objects.requireNonNull(getClientUseCase);
    }
    
    @GET
    @Operation(summary = "List all clients")
    public Response listClients(@QueryParam("active") Boolean active) {
        try {
            List<Client> clients;
            
            if (active == null) {
                clients = listClientsUseCase.listAllClients();
            } else if (active) {
                clients = listClientsUseCase.listActiveClients();
            } else {
                clients = listClientsUseCase.listInactiveClients();
            }
            
            var response = clients.stream()
                    .map(ClientResponse::fromDomain)
                    .collect(Collectors.toList());
            
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    @GET
    @Path("/{id}")
    @Operation(summary = "Get client by ID")
    public Response getClientById(@PathParam("id") @Parameter(description = "Client ID") String id) {
        try {
            var query = new GetClientUseCase.GetClientByIdQuery(id);
            var client = getClientUseCase.getClientById(query);
            
            var response = ClientResponse.fromDomain(client);
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    @GET
    @Path("/code/{code}")
    @Operation(summary = "Get client by code")
    public Response getClientByCode(@PathParam("code") @Parameter(description = "Client code") String code) {
        try {
            var query = new GetClientUseCase.GetClientByCodeQuery(code);
            var client = getClientUseCase.getClientByCode(query);
            
            var response = ClientResponse.fromDomain(client);
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    @POST
    @Operation(summary = "Create new client")
    public Response createClient(@Valid CreateClientRequest request) {
        try {
            var command = new CreateClientUseCase.CreateClientCommand(
                    request.code,
                    request.name
            );
            
            var client = createClientUseCase.createClient(command);
            var response = ClientResponse.fromDomain(client);
            
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    @PUT
    @Path("/{id}")
    @Operation(summary = "Update client")
    public Response updateClient(@PathParam("id") @Parameter(description = "Client ID") String id,
                                @Valid UpdateClientRequest request) {
        try {
            var command = new UpdateClientUseCase.UpdateClientCommand(
                    id,
                    request.name,
                    request.active
            );
            
            var client = updateClientUseCase.updateClient(command);
            var response = ClientResponse.fromDomain(client);
            
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete client")
    public Response deleteClient(@PathParam("id") @Parameter(description = "Client ID") String id) {
        try {
            var command = new DeleteClientUseCase.DeleteClientCommand(id);
            deleteClientUseCase.deleteClient(command);
            
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    // DTOs
    public static record CreateClientRequest(
            @NotBlank String code,
            @NotBlank String name
    ) {}
    
    public static record UpdateClientRequest(
            @NotBlank String name,
            boolean active
    ) {}
    
    public static record ClientResponse(
            String id,
            String code,
            String name,
            boolean active,
            LocalDateTime createdAt
    ) {
        public static ClientResponse fromDomain(Client client) {
            return new ClientResponse(
                    client.getId().value().toString(),
                    client.getCode().value(),
                    client.getName(),
                    client.isActive(),
                    client.getCreatedAt()
            );
        }
    }
    
    public static record ErrorResponse(String message) {}
}