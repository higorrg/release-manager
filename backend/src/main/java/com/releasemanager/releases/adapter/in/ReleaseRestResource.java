package com.releasemanager.releases.adapter.in;

import com.releasemanager.releases.application.port.in.*;
import com.releasemanager.releases.domain.model.ReleaseStatus;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import java.util.List;

@Path("/api/v1/releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReleaseRestResource {

    @Inject
    CreateReleaseUseCase createReleaseUseCase;

    @Inject
    UpdateReleaseStatusUseCase updateReleaseStatusUseCase;

    @Inject
    GetReleasesUseCase getReleasesUseCase;

    @Inject
    ManageReleaseClientEnvironmentUseCase manageReleaseClientEnvironmentUseCase;

    @Inject
    SecurityContext securityContext;

    public record CreateReleaseRequest(String productName, String version) {}
    
    public record UpdateStatusRequest(String status, String observation) {}

    @POST
    @RolesAllowed({"admin", "release-manager"})
    public Response createRelease(CreateReleaseRequest request) {
        var command = new CreateReleaseUseCase.CreateReleaseCommand(
            request.productName(), 
            request.version()
        );
        
        var result = createReleaseUseCase.createRelease(command);
        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    @GET
    @RolesAllowed({"admin", "release-manager", "viewer"})
    public Response getReleases(
            @QueryParam("productName") String productName,
            @QueryParam("version") String version,
            @QueryParam("status") String status,
            @QueryParam("page") @DefaultValue("0") Integer page,
            @QueryParam("size") @DefaultValue("20") Integer size) {
        
        ReleaseStatus releaseStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                releaseStatus = ReleaseStatus.fromDisplayName(status);
            } catch (IllegalArgumentException e) {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Status inválido: " + status)
                    .build();
            }
        }

        var query = new GetReleasesUseCase.ReleaseQuery(
            productName, version, releaseStatus, page, size);
        
        var result = getReleasesUseCase.getReleases(query);
        return Response.ok(result).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "release-manager", "viewer"})
    public Response getReleaseById(@PathParam("id") Long id) {
        try {
            var result = getReleasesUseCase.getReleaseById(id);
            return Response.ok(result).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("Release não encontrada")
                .build();
        }
    }

    @PUT
    @Path("/{id}/status")
    @RolesAllowed({"admin", "release-manager"})
    public Response updateStatus(@PathParam("id") Long id, UpdateStatusRequest request) {
        try {
            var status = ReleaseStatus.fromDisplayName(request.status());
            var userName = securityContext.getUserPrincipal().getName();
            
            var command = new UpdateReleaseStatusUseCase.UpdateStatusCommand(
                id, status, request.observation(), userName);
            
            var result = updateReleaseStatusUseCase.updateStatus(command);
            return Response.ok(result).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(e.getMessage())
                .build();
        }
    }

    @GET
    @Path("/{id}/client-environments")
    @RolesAllowed({"admin", "release-manager", "viewer"})
    public Response getClientEnvironments(@PathParam("id") Long id) {
        var result = manageReleaseClientEnvironmentUseCase.getClientEnvironments(id);
        return Response.ok(result).build();
    }

    @POST
    @Path("/{id}/client-environments")
    @RolesAllowed({"admin", "release-manager"})
    public Response addClientEnvironment(@PathParam("id") Long id, 
                                       ManageReleaseClientEnvironmentUseCase.AddClientEnvironmentCommand command) {
        try {
            var modifiedCommand = new ManageReleaseClientEnvironmentUseCase.AddClientEnvironmentCommand(
                id, command.clientCode(), command.environment());
            manageReleaseClientEnvironmentUseCase.addClientEnvironment(modifiedCommand);
            return Response.status(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(e.getMessage())
                .build();
        }
    }

    @DELETE
    @Path("/{id}/client-environments")
    @RolesAllowed({"admin", "release-manager"})
    public Response removeClientEnvironment(@PathParam("id") Long id,
                                          ManageReleaseClientEnvironmentUseCase.RemoveClientEnvironmentCommand command) {
        try {
            var modifiedCommand = new ManageReleaseClientEnvironmentUseCase.RemoveClientEnvironmentCommand(
                id, command.clientCode(), command.environment());
            manageReleaseClientEnvironmentUseCase.removeClientEnvironment(modifiedCommand);
            return Response.ok().build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(e.getMessage())
                .build();
        }
    }

    @GET
    @Path("/status-options")
    @RolesAllowed({"admin", "release-manager", "viewer"})
    public Response getStatusOptions() {
        var statuses = List.of(ReleaseStatus.values()).stream()
            .map(status -> new StatusOption(status.name(), status.getDisplayName()))
            .toList();
        return Response.ok(statuses).build();
    }

    public record StatusOption(String value, String label) {}
}