package com.empresa.app.clientmanagement.adapter.in.web;

import com.empresa.app.clientmanagement.adapter.in.dto.ClientResponse;
import com.empresa.app.clientmanagement.adapter.in.dto.CreateClientRequest;
import com.empresa.app.clientmanagement.adapter.in.dto.UpdateClientRequest;
import com.empresa.app.clientmanagement.adapter.in.dto.EnvironmentResponse;
import com.empresa.app.clientmanagement.application.port.in.ClientManagementUseCase;
import com.empresa.app.clientmanagement.domain.model.Client;
import com.empresa.app.clientmanagement.domain.model.Environment;
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
    ClientManagementUseCase clientManagementUseCase;

    @GET
    @Operation(summary = "Listar clientes", description = "Lista todos os clientes cadastrados")
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
    @Path("/{clientId}")
    @Operation(summary = "Buscar cliente por ID", description = "Busca um cliente específico por ID")
    public Response getClient(@PathParam("clientId") String clientId) {
        try {
            UUID id = UUID.fromString(clientId);
            return clientManagementUseCase.findClientById(id)
                .map(client -> Response.ok(ClientResponse.from(client)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar cliente: " + e.getMessage(), e);
        }
    }

    @POST
    @Operation(summary = "Criar cliente", description = "Cria um novo cliente")
    @RolesAllowed("admin")
    public Response createClient(CreateClientRequest request) {
        try {
            var command = new ClientManagementUseCase.CreateClientCommand(
                request.clientCode(),
                request.name(),
                request.description()
            );
            
            Client client = clientManagementUseCase.createClient(command);
            ClientResponse response = ClientResponse.from(client);
            
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar cliente: " + e.getMessage(), e);
        }
    }

    @PUT
    @Path("/{clientId}")
    @Operation(summary = "Atualizar cliente", description = "Atualiza um cliente existente")
    @RolesAllowed("admin")
    public Response updateClient(@PathParam("clientId") String clientId, UpdateClientRequest request) {
        try {
            UUID id = UUID.fromString(clientId);
            var command = new ClientManagementUseCase.UpdateClientCommand(
                id,
                request.name(),
                request.description()
            );
            
            Client client = clientManagementUseCase.updateClient(command);
            return Response.ok(ClientResponse.from(client)).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar cliente: " + e.getMessage(), e);
        }
    }

    @DELETE
    @Path("/{clientId}")
    @Operation(summary = "Excluir cliente", description = "Exclui um cliente (apenas se não estiver em uso)")
    @RolesAllowed("admin")
    public Response deleteClient(@PathParam("clientId") String clientId) {
        try {
            UUID id = UUID.fromString(clientId);
            clientManagementUseCase.deleteClient(id);
            return Response.noContent().build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao excluir cliente: " + e.getMessage(), e);
        }
    }

    @GET
    @Path("/environments")
    @Operation(summary = "Listar ambientes disponíveis", description = "Lista todos os ambientes disponíveis")
    public Response getAllEnvironments() {
        try {
            List<Environment> environments = clientManagementUseCase.findAllEnvironments();
            
            List<EnvironmentResponse> response = environments.stream()
                .map(EnvironmentResponse::from)
                .collect(Collectors.toList());
                
            return Response.ok(response).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar ambientes: " + e.getMessage(), e);
        }
    }
}