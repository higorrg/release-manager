package com.empresa.releasemanager.client.adapter.in;

import com.empresa.releasemanager.client.adapter.in.dto.*;
import com.empresa.releasemanager.client.application.port.in.ClientUseCase;
import com.empresa.releasemanager.client.application.service.ClientService;
import com.empresa.releasemanager.client.domain.model.Client;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClientRestResource {

    @Inject
    ClientUseCase clientUseCase;

    @POST
    @RolesAllowed({"release-manager", "admin"})
    public Response createClient(@Valid CreateClientRequest request) {
        try {
            var command = new ClientUseCase.CreateClientCommand(
                request.clientCode(),
                request.companyName(),
                request.contactEmail(),
                request.contactPhone(),
                request.isBetaPartner(),
                request.notes()
            );

            Client client = clientUseCase.createClient(command);
            return Response.status(201).entity(ClientResponse.from(client)).build();
        } catch (ClientService.DuplicateClientCodeException e) {
            return Response.status(409).entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(400).entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @GET
    @RolesAllowed({"release-manager", "qa", "dev", "viewer"})
    public Response getAllClients(@QueryParam("active") @DefaultValue("true") boolean activeOnly) {
        List<Client> clients = activeOnly 
            ? clientUseCase.findAllActiveClients()
            : clientUseCase.findAllClients();
        
        List<ClientResponse> response = clients.stream()
            .map(ClientResponse::from)
            .toList();
        
        return Response.ok(response).build();
    }

    @GET
    @Path("/{clientCode}")
    @RolesAllowed({"release-manager", "qa", "dev", "viewer"})
    public Response getClientByCode(@PathParam("clientCode") String clientCode) {
        return clientUseCase.findClientByCode(clientCode)
            .map(client -> Response.ok(ClientResponse.from(client)).build())
            .orElse(Response.status(404).entity(new ErrorResponse("Client not found")).build());
    }

    @PUT
    @Path("/{clientCode}")
    @RolesAllowed({"release-manager", "admin"})
    public Response updateClient(@PathParam("clientCode") String clientCode, @Valid UpdateClientRequest request) {
        try {
            var command = new ClientUseCase.UpdateClientCommand(
                clientCode,
                request.companyName(),
                request.contactEmail(),
                request.contactPhone(),
                request.isBetaPartner(),
                request.notes()
            );

            clientUseCase.updateClient(command);
            return Response.noContent().build();
        } catch (ClientService.ClientNotFoundException e) {
            return Response.status(404).entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(400).entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{clientCode}/activate")
    @RolesAllowed({"release-manager", "admin"})
    public Response activateClient(@PathParam("clientCode") String clientCode) {
        try {
            clientUseCase.activateClient(clientCode);
            return Response.noContent().build();
        } catch (ClientService.ClientNotFoundException e) {
            return Response.status(404).entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(400).entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{clientCode}/deactivate")
    @RolesAllowed({"release-manager", "admin"})
    public Response deactivateClient(@PathParam("clientCode") String clientCode) {
        try {
            clientUseCase.deactivateClient(clientCode);
            return Response.noContent().build();
        } catch (ClientService.ClientNotFoundException e) {
            return Response.status(404).entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(400).entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @GET
    @Path("/beta-partners")
    @RolesAllowed({"release-manager", "qa", "dev", "viewer"})
    public Response getBetaPartners() {
        List<Client> clients = clientUseCase.findBetaPartners();
        List<ClientResponse> response = clients.stream()
            .map(ClientResponse::from)
            .toList();
        
        return Response.ok(response).build();
    }

    public record ErrorResponse(String message) {}
}