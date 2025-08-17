package com.empresa.app.release.adapter.in.web;

import com.empresa.app.release.adapter.in.dto.ClientResponse;
import com.empresa.app.release.adapter.in.dto.CreateClientRequest;
import com.empresa.app.release.adapter.in.dto.ErrorResponse;
import com.empresa.app.release.adapter.in.dto.UpdateClientRequest;
import com.empresa.app.release.application.port.in.ReleaseManagementUseCase;
import com.empresa.app.release.domain.model.Client;
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

@Path("/api/v1/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Client Management", description = "Operações de gerenciamento de clientes")
@RolesAllowed({"user", "admin"})
public class ClientController {

    @Inject
    ReleaseManagementUseCase releaseManagementUseCase;

    @GET
    @Operation(summary = "Listar clientes", description = "Lista todos os clientes cadastrados")
    public Response getAllClients() {
        try {
            List<Client> clients = releaseManagementUseCase.findAllClients();
            
            List<ClientResponse> response = clients.stream()
                .map(ClientResponse::from)
                .collect(Collectors.toList());
                
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao buscar clientes: " + e.getMessage()))
                .build();
        }
    }

    @GET
    @Path("/{clientId}")
    @Operation(summary = "Buscar cliente por ID", description = "Busca um cliente específico por ID")
    public Response getClient(@PathParam("clientId") String clientId) {
        try {
            UUID id = UUID.fromString(clientId);
            return releaseManagementUseCase.findClientById(id)
                .map(client -> Response.ok(ClientResponse.from(client)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Cliente não encontrado"))
                    .build());
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao buscar cliente: " + e.getMessage()))
                .build();
        }
    }

    @POST
    @Operation(summary = "Criar cliente", description = "Cria um novo cliente")
    @RolesAllowed("admin")
    public Response createClient(CreateClientRequest request) {
        try {
            var command = new ReleaseManagementUseCase.CreateClientCommand(
                request.clientCode(),
                request.name(),
                request.description()
            );
            
            Client client = releaseManagementUseCase.createClient(command);
            ClientResponse response = ClientResponse.from(client);
            
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao criar cliente: " + e.getMessage()))
                .build();
        }
    }

    @PUT
    @Path("/{clientId}")
    @Operation(summary = "Atualizar cliente", description = "Atualiza um cliente existente")
    @RolesAllowed("admin")
    public Response updateClient(@PathParam("clientId") String clientId, UpdateClientRequest request) {
        try {
            UUID id = UUID.fromString(clientId);
            var command = new ReleaseManagementUseCase.UpdateClientCommand(
                id,
                request.name(),
                request.description()
            );
            
            Client client = releaseManagementUseCase.updateClient(command);
            return Response.ok(ClientResponse.from(client)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao atualizar cliente: " + e.getMessage()))
                .build();
        }
    }

    @DELETE
    @Path("/{clientId}")
    @Operation(summary = "Excluir cliente", description = "Exclui um cliente (apenas se não estiver em uso)")
    @RolesAllowed("admin")
    public Response deleteClient(@PathParam("clientId") String clientId) {
        try {
            UUID id = UUID.fromString(clientId);
            releaseManagementUseCase.deleteClient(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao excluir cliente: " + e.getMessage()))
                .build();
        }
    }
}