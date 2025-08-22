package com.releasemanager.clients.adapter.in;

import com.releasemanager.clients.application.port.in.ManageClientsUseCase;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/v1/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClientRestResource {

    @Inject
    ManageClientsUseCase manageClientsUseCase;

    public record CreateClientRequest(String code, String name) {}
    
    public record UpdateClientRequest(String name, Boolean active) {}

    @POST
    @RolesAllowed({"admin", "release-manager"})
    public Response createClient(CreateClientRequest request) {
        try {
            var command = new ManageClientsUseCase.CreateClientCommand(request.code(), request.name());
            var result = manageClientsUseCase.createClient(command);
            return Response.status(Response.Status.CREATED).entity(result).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(e.getMessage())
                .build();
        }
    }

    @GET
    @RolesAllowed({"admin", "release-manager", "viewer"})
    public Response getAllClients(@QueryParam("active") Boolean active) {
        if (active != null && active) {
            var result = manageClientsUseCase.getActiveClients();
            return Response.ok(result).build();
        } else {
            var result = manageClientsUseCase.getAllClients();
            return Response.ok(result).build();
        }
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "release-manager", "viewer"})
    public Response getClientById(@PathParam("id") Long id) {
        try {
            var result = manageClientsUseCase.getClientById(id);
            return Response.ok(result).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(e.getMessage())
                .build();
        }
    }

    @GET
    @Path("/code/{code}")
    @RolesAllowed({"admin", "release-manager", "viewer"})
    public Response getClientByCode(@PathParam("code") String code) {
        try {
            var result = manageClientsUseCase.getClientByCode(code);
            return Response.ok(result).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(e.getMessage())
                .build();
        }
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"admin", "release-manager"})
    public Response updateClient(@PathParam("id") Long id, UpdateClientRequest request) {
        try {
            var command = new ManageClientsUseCase.UpdateClientCommand(id, request.name(), request.active());
            var result = manageClientsUseCase.updateClient(command);
            return Response.ok(result).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(e.getMessage())
                .build();
        }
    }
}