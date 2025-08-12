package com.empresa.app.release.adapter.in;

import com.empresa.app.release.application.port.in.ReleaseManagementUseCase;
import com.empresa.app.release.domain.model.ReleaseStatus;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.ApiResponse;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.UUID;

@Path("/api/v1/releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Release Management", description = "Operações de gerenciamento de releases")
@SecurityRequirement(name = "oidc")
public class ReleaseRestResource {

    @Inject
    ReleaseManagementUseCase releaseManagementUseCase;

    @POST
    @Path("/pipeline")
    @Operation(summary = "Criar release via pipeline", 
               description = "Cria uma nova release automaticamente a partir da pipeline")
    @ApiResponse(responseCode = "201", description = "Release criada com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @ApiResponse(responseCode = "409", description = "Release já existe")
    public Response createReleaseFromPipeline(@Valid CreateReleaseRequest request) {
        try {
            var command = new ReleaseManagementUseCase.CreateReleaseCommand(
                    request.productName(), 
                    request.version()
            );
            var release = releaseManagementUseCase.createReleaseFromPipeline(command);
            var response = ReleaseResponse.from(release);
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{releaseId}/release-notes")
    @RolesAllowed({"release-manager", "admin"})
    @Operation(summary = "Atualizar release notes", 
               description = "Atualiza as release notes de uma release")
    @ApiResponse(responseCode = "200", description = "Release notes atualizadas com sucesso")
    @ApiResponse(responseCode = "404", description = "Release não encontrada")
    public Response updateReleaseNotes(@PathParam("releaseId") UUID releaseId,
                                     @Valid UpdateReleaseNotesRequest request) {
        try {
            var command = new ReleaseManagementUseCase.UpdateReleaseNotesCommand(
                    releaseId, 
                    request.releaseNotes()
            );
            var release = releaseManagementUseCase.updateReleaseNotes(command);
            var response = ReleaseResponse.from(release);
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{releaseId}/prerequisites")
    @RolesAllowed({"release-manager", "admin"})
    @Operation(summary = "Atualizar pré-requisitos", 
               description = "Atualiza os pré-requisitos de uma release")
    @ApiResponse(responseCode = "200", description = "Pré-requisitos atualizados com sucesso")
    @ApiResponse(responseCode = "404", description = "Release não encontrada")
    public Response updatePrerequisites(@PathParam("releaseId") UUID releaseId,
                                      @Valid UpdatePrerequisitesRequest request) {
        try {
            var command = new ReleaseManagementUseCase.UpdatePrerequisitesCommand(
                    releaseId, 
                    request.prerequisites()
            );
            var release = releaseManagementUseCase.updatePrerequisites(command);
            var response = ReleaseResponse.from(release);
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @GET
    @Path("/{releaseId}")
    @RolesAllowed({"release-manager", "admin"})
    @Operation(summary = "Buscar release por ID", 
               description = "Busca uma release específica pelo ID")
    @ApiResponse(responseCode = "200", description = "Release encontrada")
    @ApiResponse(responseCode = "404", description = "Release não encontrada")
    public Response findReleaseById(@PathParam("releaseId") UUID releaseId) {
        var release = releaseManagementUseCase.findReleaseById(releaseId);
        if (release.isPresent()) {
            var response = ReleaseResponse.from(release.get());
            return Response.ok(response).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Release not found")).build();
        }
    }

    @GET
    @Path("/{releaseId}/history")
    @RolesAllowed({"release-manager", "admin"})
    @Operation(summary = "Histórico de mudanças de status", 
               description = "Lista o histórico de mudanças de status de uma release")
    @ApiResponse(responseCode = "200", description = "Histórico recuperado com sucesso")
    @ApiResponse(responseCode = "404", description = "Release não encontrada")
    public Response getReleaseStatusHistory(@PathParam("releaseId") UUID releaseId) {
        try {
            var history = releaseManagementUseCase.findReleaseStatusHistory(releaseId);
            var response = history.stream()
                    .map(ReleaseStatusHistoryResponse::from)
                    .toList();
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    // DTOs
    public record CreateReleaseRequest(
            @NotBlank(message = "Product name is required") String productName,
            @NotBlank(message = "Version is required") String version) {}

    public record UpdateStatusRequest(
            @NotNull(message = "Status is required") ReleaseStatus status,
            String comments) {}

    public record UpdateReleaseNotesRequest(String releaseNotes) {}

    public record UpdatePrerequisitesRequest(String prerequisites) {}

    public record ErrorResponse(String message) {}
}BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        } catch (IllegalStateException e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{releaseId}/status")
    @RolesAllowed({"release-manager", "admin"})
    @Operation(summary = "Atualizar status da release", 
               description = "Atualiza o status de uma release existente")
    @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso")
    @ApiResponse(responseCode = "404", description = "Release não encontrada")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    public Response updateReleaseStatus(@PathParam("releaseId") UUID releaseId,
                                      @Valid UpdateStatusRequest request,
                                      @Context SecurityContext securityContext) {
        try {
            var userPrincipal = securityContext.getUserPrincipal();
            var changedBy = userPrincipal != null ? userPrincipal.getName() : "UNKNOWN";
            
            var command = new ReleaseManagementUseCase.UpdateReleaseStatusCommand(
                    releaseId,
                    request.status(),
                    changedBy,
                    request.comments()
            );
            var release = releaseManagementUseCase.updateReleaseStatus(command);
            var response = ReleaseResponse.from(release);
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.