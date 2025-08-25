package com.empresa.app.releases.adapter.in;

import com.empresa.app.authentication.domain.model.UserId;
import com.empresa.app.releases.application.port.in.CreateReleaseUseCase;
import com.empresa.app.releases.application.port.in.GetReleaseUseCase;
import com.empresa.app.releases.application.port.in.ListReleasesUseCase;
import com.empresa.app.releases.application.port.in.UpdateReleaseStatusUseCase;
import com.empresa.app.releases.domain.model.ProductName;
import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.releases.domain.model.ReleaseId;
import com.empresa.app.releases.domain.model.ReleaseVersion;
import com.empresa.app.shared.domain.ReleaseStatus;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Path("/api/v1/releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Releases", description = "Release management operations")
public class ReleaseRestResource {
    
    private final CreateReleaseUseCase createReleaseUseCase;
    private final UpdateReleaseStatusUseCase updateReleaseStatusUseCase;
    private final GetReleaseUseCase getReleaseUseCase;
    private final ListReleasesUseCase listReleasesUseCase;
    
    @Inject
    public ReleaseRestResource(CreateReleaseUseCase createReleaseUseCase,
                              UpdateReleaseStatusUseCase updateReleaseStatusUseCase,
                              GetReleaseUseCase getReleaseUseCase,
                              ListReleasesUseCase listReleasesUseCase) {
        this.createReleaseUseCase = Objects.requireNonNull(createReleaseUseCase);
        this.updateReleaseStatusUseCase = Objects.requireNonNull(updateReleaseStatusUseCase);
        this.getReleaseUseCase = Objects.requireNonNull(getReleaseUseCase);
        this.listReleasesUseCase = Objects.requireNonNull(listReleasesUseCase);
    }
    
    @POST
    @Operation(summary = "Create new release")
    public Response createRelease(@Valid CreateReleaseRequest request) {
        try {
            var command = new CreateReleaseUseCase.CreateReleaseCommand(
                new ProductName(request.productName),
                new ReleaseVersion(request.version),
                request.releaseNotes,
                request.prerequisites,
                request.downloadUrl
            );
            
            var release = createReleaseUseCase.create(command);
            
            var response = ReleaseResponse.fromDomain(release);
            
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    @GET
    @Path("/{id}")
    @Operation(summary = "Get release by ID")
    public Response getRelease(@PathParam("id") @Parameter(description = "Release ID") String id) {
        try {
            var releaseId = new ReleaseId(UUID.fromString(id));
            
            return getReleaseUseCase.getById(releaseId)
                    .map(release -> Response.ok(ReleaseResponse.fromDomain(release)).build())
                    .orElse(Response.status(Response.Status.NOT_FOUND)
                            .entity(new ErrorResponse("Release not found")).build());
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Invalid release ID format")).build();
        }
    }
    
    @GET
    @Operation(summary = "List releases")
    public Response listReleases(
            @QueryParam("productName") @Parameter(description = "Filter by product name") String productName,
            @QueryParam("status") @Parameter(description = "Filter by status") String status) {
        try {
            List<Release> releases;
            
            if (productName != null && status != null) {
                releases = listReleasesUseCase.listByProductNameAndStatus(
                        new ProductName(productName), 
                        ReleaseStatus.valueOf(status)
                );
            } else if (productName != null) {
                releases = listReleasesUseCase.listByProductName(new ProductName(productName));
            } else if (status != null) {
                releases = listReleasesUseCase.listByStatus(ReleaseStatus.valueOf(status));
            } else {
                releases = listReleasesUseCase.listAll();
            }
            
            var response = releases.stream()
                    .map(ReleaseResponse::fromDomain)
                    .collect(Collectors.toList());
            
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    @PUT
    @Path("/{id}/status")
    @Operation(summary = "Update release status")
    public Response updateStatus(@PathParam("id") @Parameter(description = "Release ID") String id,
                                @Valid UpdateStatusRequest request) {
        try {
            var command = new UpdateReleaseStatusUseCase.UpdateStatusCommand(
                    new ReleaseId(UUID.fromString(id)),
                    ReleaseStatus.valueOf(request.status),
                    new UserId(UUID.fromString(request.updatedBy)),
                    request.observation
            );
            
            var release = updateReleaseStatusUseCase.updateStatus(command);
            
            return Response.ok(ReleaseResponse.fromDomain(release)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    // DTOs
    public static record CreateReleaseRequest(
            @NotBlank String productName,
            @NotBlank String version,
            String releaseNotes,
            String prerequisites,
            String downloadUrl
    ) {}
    
    public static record UpdateStatusRequest(
            @NotBlank String status,
            @NotBlank String updatedBy,
            String observation
    ) {}
    
    public static record ReleaseResponse(
            String id,
            String productName,
            String version,
            String status,
            String statusDisplayName,
            String releaseNotes,
            String prerequisites,
            String downloadUrl,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        public static ReleaseResponse fromDomain(Release release) {
            return new ReleaseResponse(
                    release.getId().toString(),
                    release.getProductName().value(),
                    release.getVersion().value(),
                    release.getStatus().name(),
                    release.getStatus().getDisplayName(),
                    release.getReleaseNotes(),
                    release.getPrerequisites(),
                    release.getDownloadUrl(),
                    release.getCreatedAt(),
                    release.getUpdatedAt()
            );
        }
    }
    
    public static record ErrorResponse(String message) {}
}