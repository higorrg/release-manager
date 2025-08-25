package com.empresa.app.releases.adapter.in;

import com.empresa.app.releases.application.port.in.CreateReleaseUseCase;
import com.empresa.app.releases.domain.model.ProductName;
import com.empresa.app.releases.domain.model.ReleaseVersion;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.Objects;

@Path("/api/v1/pipeline/releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Pipeline", description = "Pipeline integration operations")
public class PipelineRestResource {
    
    private final CreateReleaseUseCase createReleaseUseCase;
    
    @Inject
    public PipelineRestResource(CreateReleaseUseCase createReleaseUseCase) {
        this.createReleaseUseCase = Objects.requireNonNull(createReleaseUseCase);
    }
    
    @POST
    @Operation(summary = "Register release from pipeline", 
               description = "Registers a new release with MR_APROVADO status from CI/CD pipeline")
    public Response registerRelease(@Valid PipelineReleaseRequest request) {
        try {
            var command = new CreateReleaseUseCase.CreateReleaseCommand(
                new ProductName(request.productName),
                new ReleaseVersion(request.version),
                request.releaseNotes,
                request.prerequisites,
                request.downloadUrl
            );
            
            var release = createReleaseUseCase.create(command);
            
            var response = PipelineReleaseResponse.fromDomain(release);
            
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    // DTOs
    public static record PipelineReleaseRequest(
            @NotBlank String productName,
            @NotBlank String version,
            String releaseNotes,
            String prerequisites,
            String downloadUrl
    ) {}
    
    public static record PipelineReleaseResponse(
            String id,
            String productName,
            String version,
            String status,
            String message
    ) {
        public static PipelineReleaseResponse fromDomain(com.empresa.app.releases.domain.model.Release release) {
            return new PipelineReleaseResponse(
                    release.getId().toString(),
                    release.getProductName().value(),
                    release.getVersion().value(),
                    release.getStatus().name(),
                    String.format("Release %s-%s registered successfully with status %s", 
                                release.getProductName().value(), 
                                release.getVersion().value(), 
                                release.getStatus().getDisplayName())
            );
        }
    }
    
    public static record ErrorResponse(String message) {}
}