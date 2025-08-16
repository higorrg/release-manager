package com.empresa.app.release.adapter.in.web;

import com.empresa.app.release.adapter.in.dto.AddControlledClientRequest;
import com.empresa.app.release.adapter.in.dto.CreateReleaseRequest;
import com.empresa.app.release.adapter.in.dto.ErrorResponse;
import com.empresa.app.release.adapter.in.dto.ReleaseResponse;
import com.empresa.app.release.adapter.in.dto.ReleaseStatusHistoryResponse;
import com.empresa.app.release.adapter.in.dto.UpdatePrerequisitesRequest;
import com.empresa.app.release.adapter.in.dto.UpdateReleaseNotesRequest;
import com.empresa.app.release.adapter.in.dto.UpdateStatusRequest;
import com.empresa.app.release.application.port.in.ReleaseManagementUseCase;
import com.empresa.app.release.application.port.out.ProductRepository;
import com.empresa.app.release.domain.model.Product;
import com.empresa.app.release.domain.model.Release;
import com.empresa.app.release.domain.model.ReleaseStatus;
import com.empresa.app.release.domain.model.ReleaseStatusHistory;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Path("/api/v1/releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Release Management", description = "Operações de gerenciamento de releases")
public class ReleaseController {

    @Inject
    ReleaseManagementUseCase releaseManagementUseCase;

    @Inject
    ProductRepository productRepository;

    @POST
    @Path("/pipeline")
    @Operation(summary = "Criar uma nova release", description = "Cria uma nova release a partir da pipeline")
    public Response createRelease(CreateReleaseRequest request) {
        try {
            var command = new ReleaseManagementUseCase.CreateReleaseCommand(
                request.productName(),
                request.version()
            );
            
            Release release = releaseManagementUseCase.createReleaseFromPipeline(command);
            ReleaseResponse response = mapToResponse(release);
            
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao criar release: " + e.getMessage()))
                .build();
        }
    }

    @GET
    @Operation(summary = "Listar releases", description = "Lista todas as releases ou por produto")
    public Response listReleases(@QueryParam("productId") String productId) {
        try {
            List<Release> releases;
            
            if (productId != null && !productId.isEmpty()) {
                releases = releaseManagementUseCase.findReleasesByProduct(UUID.fromString(productId));
            } else {
                releases = releaseManagementUseCase.findAllReleases();
            }
            
            List<ReleaseResponse> response = releases.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao buscar releases: " + e.getMessage()))
                .build();
        }
    }

    @GET
    @Path("/{releaseId}")
    @Operation(summary = "Buscar release por ID", description = "Busca uma release específica por ID")
    public Response getRelease(@PathParam("releaseId") String releaseId) {
        try {
            UUID id = UUID.fromString(releaseId);
            return releaseManagementUseCase.findReleaseById(id)
                .map(release -> Response.ok(mapToResponse(release)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Release não encontrada"))
                    .build());
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao buscar release: " + e.getMessage()))
                .build();
        }
    }

    @PUT
    @Path("/{releaseId}/status")
    @Operation(summary = "Atualizar status da release", description = "Atualiza o status de uma release")
    public Response updateReleaseStatus(@PathParam("releaseId") String releaseId, 
                                      UpdateStatusRequest request) {
        try {
            UUID id = UUID.fromString(releaseId);
            var command = new ReleaseManagementUseCase.UpdateReleaseStatusCommand(
                id,
                ReleaseStatus.valueOf(request.newStatus()),
                request.changedBy(),
                request.comments()
            );
            
            Release release = releaseManagementUseCase.updateReleaseStatus(command);
            return Response.ok(mapToResponse(release)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao atualizar status: " + e.getMessage()))
                .build();
        }
    }

    @PUT
    @Path("/{releaseId}/release-notes")
    @Operation(summary = "Atualizar release notes", description = "Atualiza as release notes de uma release")
    public Response updateReleaseNotes(@PathParam("releaseId") String releaseId,
                                     UpdateReleaseNotesRequest request) {
        try {
            UUID id = UUID.fromString(releaseId);
            var command = new ReleaseManagementUseCase.UpdateReleaseNotesCommand(
                id,
                request.releaseNotes()
            );
            
            Release release = releaseManagementUseCase.updateReleaseNotes(command);
            return Response.ok(mapToResponse(release)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao atualizar release notes: " + e.getMessage()))
                .build();
        }
    }

    @PUT
    @Path("/{releaseId}/prerequisites")
    @Operation(summary = "Atualizar pré-requisitos", description = "Atualiza os pré-requisitos de uma release")
    public Response updatePrerequisites(@PathParam("releaseId") String releaseId,
                                      UpdatePrerequisitesRequest request) {
        try {
            UUID id = UUID.fromString(releaseId);
            var command = new ReleaseManagementUseCase.UpdatePrerequisitesCommand(
                id,
                request.prerequisites()
            );
            
            Release release = releaseManagementUseCase.updatePrerequisites(command);
            return Response.ok(mapToResponse(release)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao atualizar pré-requisitos: " + e.getMessage()))
                .build();
        }
    }

    @GET
    @Path("/{releaseId}/history")
    @Operation(summary = "Buscar histórico da release", description = "Busca o histórico de mudanças de status de uma release")
    public Response getReleaseHistory(@PathParam("releaseId") String releaseId) {
        try {
            UUID id = UUID.fromString(releaseId);
            List<ReleaseStatusHistory> history = releaseManagementUseCase.findReleaseStatusHistory(id);
            
            List<ReleaseStatusHistoryResponse> response = history.stream()
                .map(this::mapToHistoryResponse)
                .collect(Collectors.toList());
                
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao buscar histórico: " + e.getMessage()))
                .build();
        }
    }

    private ReleaseResponse mapToResponse(Release release) {
        Product product = productRepository.findById(release.getProductId()).orElse(null);
        return ReleaseResponse.from(release, product);
    }

    @POST
    @Path("/{releaseId}/controlled-clients")
    @Operation(summary = "Adicionar cliente controlado", description = "Adiciona um cliente controlado à release")
    public Response addControlledClient(@PathParam("releaseId") String releaseId,
                                      AddControlledClientRequest request) {
        try {
            // Temporariamente retorna a release sem modificações
            // TODO: Implementar lógica de clientes controlados
            UUID id = UUID.fromString(releaseId);
            return releaseManagementUseCase.findReleaseById(id)
                .map(release -> Response.ok(mapToResponse(release)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Release não encontrada"))
                    .build());
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao adicionar cliente controlado: " + e.getMessage()))
                .build();
        }
    }

    @DELETE
    @Path("/{releaseId}/controlled-clients/{clientId}")
    @Operation(summary = "Remover cliente controlado", description = "Remove um cliente controlado da release")
    public Response removeControlledClient(@PathParam("releaseId") String releaseId,
                                         @PathParam("clientId") String clientId) {
        try {
            // Temporariamente retorna a release sem modificações
            // TODO: Implementar lógica de clientes controlados
            UUID id = UUID.fromString(releaseId);
            return releaseManagementUseCase.findReleaseById(id)
                .map(release -> Response.ok(mapToResponse(release)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Release não encontrada"))
                    .build());
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse("Erro ao remover cliente controlado: " + e.getMessage()))
                .build();
        }
    }

    private ReleaseStatusHistoryResponse mapToHistoryResponse(ReleaseStatusHistory history) {
        return ReleaseStatusHistoryResponse.from(history);
    }
}