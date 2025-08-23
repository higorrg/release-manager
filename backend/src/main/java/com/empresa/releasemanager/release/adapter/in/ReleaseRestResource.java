package com.empresa.releasemanager.release.adapter.in;

import com.empresa.releasemanager.release.adapter.in.dto.*;
import com.empresa.releasemanager.release.application.port.in.ReleaseUseCase;
import com.empresa.releasemanager.release.application.service.ReleaseService;
import com.empresa.releasemanager.release.domain.model.Environment;
import com.empresa.releasemanager.release.domain.model.Release;
import com.empresa.releasemanager.release.domain.model.ReleaseStatus;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.List;

@Path("/api/releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReleaseRestResource {

    @Inject
    ReleaseUseCase releaseUseCase;

    @Inject
    SecurityContext securityContext;

    @POST
    @RolesAllowed({"release-manager", "pipeline"})
    public Response createRelease(@Valid CreateReleaseRequest request) {
        try {
            var command = new ReleaseUseCase.CreateReleaseCommand(
                request.productName(),
                request.version(),
                request.versionType(),
                request.branchName(),
                request.commitHash(),
                getCurrentUser()
            );

            Release release = releaseUseCase.createRelease(command);
            return Response.status(201).entity(ReleaseResponse.from(release)).build();
        } catch (Exception e) {
            return Response.status(400).entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @GET
    @RolesAllowed({"release-manager", "qa", "dev", "viewer"})
    public Response getAllReleases() {
        List<Release> releases = releaseUseCase.findAllReleases();
        List<ReleaseResponse> response = releases.stream()
            .map(ReleaseResponse::from)
            .toList();
        
        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"release-manager", "qa", "dev", "viewer"})
    public Response getReleaseById(@PathParam("id") Long id) {
        // Note: For simplicity, using the existing findByProductAndVersion method
        // In a real implementation, we'd add a findById method to the use case
        return Response.status(501).entity(new ErrorResponse("Not implemented yet")).build();
    }

    @GET
    @Path("/product/{productName}")
    @RolesAllowed({"release-manager", "qa", "dev", "viewer"})
    public Response getReleasesByProduct(@PathParam("productName") String productName) {
        List<Release> releases = releaseUseCase.findReleasesByProduct(productName);
        List<ReleaseResponse> response = releases.stream()
            .map(ReleaseResponse::from)
            .toList();
        
        return Response.ok(response).build();
    }

    @GET
    @Path("/product/{productName}/version/{version}")
    @RolesAllowed({"release-manager", "qa", "dev", "viewer"})
    public Response getReleaseByProductAndVersion(
            @PathParam("productName") String productName,
            @PathParam("version") String version) {
        
        return releaseUseCase.findReleaseByProductAndVersion(productName, version)
            .map(release -> Response.ok(ReleaseResponse.from(release)).build())
            .orElse(Response.status(404).entity(new ErrorResponse("Release not found")).build());
    }

    @PUT
    @Path("/{id}/status")
    @RolesAllowed({"release-manager", "qa", "dev"})
    public Response updateStatus(@PathParam("id") Long id, @Valid UpdateStatusRequest request) {
        try {
            var command = new ReleaseUseCase.UpdateStatusCommand(
                id,
                request.newStatus(),
                request.reason(),
                getCurrentUser()
            );

            releaseUseCase.updateReleaseStatus(command);
            return Response.noContent().build();
        } catch (ReleaseService.ReleaseNotFoundException e) {
            return Response.status(404).entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(400).entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @POST
    @Path("/{id}/clients")
    @RolesAllowed({"release-manager"})
    public Response addClientToRelease(@PathParam("id") Long id, @Valid AddClientRequest request) {
        try {
            var command = new ReleaseUseCase.AddClientCommand(
                id,
                request.clientCode(),
                request.environment()
            );

            releaseUseCase.addClientToRelease(command);
            return Response.noContent().build();
        } catch (ReleaseService.ReleaseNotFoundException e) {
            return Response.status(404).entity(new ErrorResponse(e.getMessage())).build();
        } catch (ReleaseService.DuplicateClientEnvironmentException e) {
            return Response.status(409).entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(400).entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @DELETE
    @Path("/{id}/clients/{clientCode}/environments/{environment}")
    @RolesAllowed({"release-manager"})
    public Response removeClientFromRelease(
            @PathParam("id") Long id,
            @PathParam("clientCode") String clientCode,
            @PathParam("environment") Environment environment) {
        
        try {
            var command = new ReleaseUseCase.RemoveClientCommand(
                id,
                clientCode,
                environment
            );

            releaseUseCase.removeClientFromRelease(command);
            return Response.noContent().build();
        } catch (ReleaseService.ReleaseNotFoundException e) {
            return Response.status(404).entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(400).entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @GET
    @Path("/status/{status}")
    @RolesAllowed({"release-manager", "qa", "dev", "viewer"})
    public Response getReleasesByStatus(@PathParam("status") ReleaseStatus status) {
        List<Release> releases = releaseUseCase.findReleasesByStatus(status);
        List<ReleaseResponse> response = releases.stream()
            .map(ReleaseResponse::from)
            .toList();
        
        return Response.ok(response).build();
    }

    // API for clients to check available versions
    @GET
    @Path("/client/{clientCode}/environment/{environment}")
    @PermitAll // Public API for clients
    public Response getAvailableReleasesForClient(
            @PathParam("clientCode") String clientCode,
            @PathParam("environment") Environment environment) {
        
        List<Release> releases = releaseUseCase.findAvailableReleasesForClient(clientCode, environment);
        List<ClientReleaseResponse> response = releases.stream()
            .map(ClientReleaseResponse::from)
            .toList();
        
        return Response.ok(response).build();
    }

    private String getCurrentUser() {
        return securityContext.getUserPrincipal() != null 
            ? securityContext.getUserPrincipal().getName() 
            : "system";
    }

    public record ErrorResponse(String message) {}
}