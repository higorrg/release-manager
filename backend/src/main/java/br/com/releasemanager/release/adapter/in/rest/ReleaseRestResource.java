package br.com.releasemanager.release.adapter.in.rest;

import br.com.releasemanager.release.application.port.in.*;
import br.com.releasemanager.release.domain.model.Environment;
import br.com.releasemanager.release.domain.model.Release;
import br.com.releasemanager.release.domain.model.ReleaseStatus;
import br.com.releasemanager.release.domain.model.Version;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReleaseRestResource {

    @Inject
    CreateReleaseUseCase createReleaseUseCase;

    @Inject
    ChangeReleaseStatusUseCase changeReleaseStatusUseCase;

    @Inject
    ListAvailableVersionsUseCase listAvailableVersionsUseCase;

    @Inject
    ManageClientEnvironmentUseCase manageClientEnvironmentUseCase;

    // US-05: Pipeline integration - Create release
    @POST
    @RolesAllowed({"release-manager", "admin"})
    public Response createRelease(CreateReleaseRequest request) {
        try {
            Version version = new Version(request.versionMajor(), request.versionMinor(), request.versionPatch());
            CreateReleaseCommand command = new CreateReleaseCommand(
                request.productName(),
                version,
                request.releaseNotes(),
                request.prerequisites(),
                request.downloadUrl()
            );

            Release release = createReleaseUseCase.createRelease(command);
            return Response.status(Response.Status.CREATED)
                .entity(ReleaseResponse.from(release))
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse(e.getMessage()))
                .build();
        }
    }

    // US-02: Change release status
    @PUT
    @Path("/{releaseId}/status")
    public Response changeStatus(@PathParam("releaseId") Long releaseId, ChangeStatusRequest request) {
        try {
            ChangeStatusCommand command = new ChangeStatusCommand(
                releaseId,
                ReleaseStatus.valueOf(request.newStatus()),
                request.changedBy(),
                request.notes()
            );

            Release release = changeReleaseStatusUseCase.changeStatus(command);
            return Response.ok(ReleaseResponse.from(release)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse(e.getMessage()))
                .build();
        }
    }

    // US-04: Add client environment association
    @POST
    @Path("/{releaseId}/clients")
    public Response addClientEnvironment(@PathParam("releaseId") Long releaseId, AddClientEnvironmentRequest request) {
        try {
            AddClientEnvironmentCommand command = 
                new AddClientEnvironmentCommand(
                    releaseId,
                    request.clientCode(),
                    Environment.valueOf(request.environment())
                );

            var clientEnvironment = manageClientEnvironmentUseCase.addClientEnvironment(command);
            return Response.status(Response.Status.CREATED)
                .entity(ClientEnvironmentResponse.from(clientEnvironment))
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse(e.getMessage()))
                .build();
        }
    }

    // US-04: Remove client environment association
    @DELETE
    @Path("/{releaseId}/clients/{clientCode}/environments/{environment}")
    public Response removeClientEnvironment(@PathParam("releaseId") Long releaseId,
                                          @PathParam("clientCode") String clientCode,
                                          @PathParam("environment") String environment) {
        try {
            RemoveClientEnvironmentCommand command = 
                new RemoveClientEnvironmentCommand(
                    releaseId,
                    clientCode,
                    Environment.valueOf(environment)
                );

            manageClientEnvironmentUseCase.removeClientEnvironment(command);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse(e.getMessage()))
                .build();
        }
    }

    // US-04: Get client environments for a release
    @GET
    @Path("/{releaseId}/clients")
    public Response getClientEnvironments(@PathParam("releaseId") Long releaseId) {
        try {
            var clientEnvironments = manageClientEnvironmentUseCase.getClientEnvironmentsByRelease(releaseId);
            List<ClientEnvironmentResponse> response = clientEnvironments.stream()
                .map(ClientEnvironmentResponse::from)
                .toList();
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse(e.getMessage()))
                .build();
        }
    }

    // US-06: List available versions for client and environment
    @GET
    @Path("/available")
    public Response listAvailableVersions(@QueryParam("clientCode") String clientCode,
                                        @QueryParam("environment") String environment,
                                        @QueryParam("productName") String productName) {
        try {
            ListVersionsQuery query = 
                new ListVersionsQuery(
                    clientCode,
                    Environment.valueOf(environment),
                    productName
                );

            List<AvailableVersionResponse> versions =
                listAvailableVersionsUseCase.listAvailableVersions(query);

            return Response.ok(versions).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse(e.getMessage()))
                .build();
        }
    }
}
