package com.empresa.app.releases.adapter.in;

import com.empresa.app.clients.domain.model.ClientCode;
import com.empresa.app.releases.application.port.in.GetAvailableReleasesForClientUseCase;
import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.shared.domain.Environment;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Path("/api/v1/public/releases/available")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Public API", description = "Public release API operations")
public class PublicReleaseRestResource {
    
    private final GetAvailableReleasesForClientUseCase getAvailableReleasesForClientUseCase;
    
    @Inject
    public PublicReleaseRestResource(GetAvailableReleasesForClientUseCase getAvailableReleasesForClientUseCase) {
        this.getAvailableReleasesForClientUseCase = Objects.requireNonNull(getAvailableReleasesForClientUseCase);
    }
    
    @GET
    @Operation(summary = "Get available releases for client", 
               description = "Returns releases available for the specified client and environment (status DISPONIVEL or CONTROLADA)")
    public Response getAvailableReleases(
            @QueryParam("clientCode") @Parameter(description = "Client code", required = true) String clientCode,
            @QueryParam("environment") @Parameter(description = "Environment (HOMOLOGACAO or PRODUCAO)", required = true) String environment) {
        
        if (clientCode == null || clientCode.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Client code is required")).build();
        }
        
        if (environment == null || environment.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Environment is required")).build();
        }
        
        try {
            var query = new GetAvailableReleasesForClientUseCase.GetAvailableReleasesQuery(
                new ClientCode(clientCode.trim()),
                Environment.valueOf(environment.trim().toUpperCase())
            );
            
            var releases = getAvailableReleasesForClientUseCase.getAvailableReleases(query);
            
            var response = releases.stream()
                    .map(PublicReleaseResponse::fromDomain)
                    .collect(Collectors.toList());
            
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Invalid environment value. Use HOMOLOGACAO or PRODUCAO")).build();
        }
    }
    
    // DTOs
    public static record PublicReleaseResponse(
            String id,
            String productName,
            String version,
            String status,
            String statusDisplayName,
            String releaseNotes,
            String prerequisites,
            String downloadUrl,
            LocalDateTime createdAt
    ) {
        public static PublicReleaseResponse fromDomain(Release release) {
            return new PublicReleaseResponse(
                    release.getId().toString(),
                    release.getProductName().value(),
                    release.getVersion().value(),
                    release.getStatus().name(),
                    release.getStatus().getDisplayName(),
                    release.getReleaseNotes(),
                    release.getPrerequisites(),
                    release.getDownloadUrl(),
                    release.getCreatedAt()
            );
        }
    }
    
    public static record ErrorResponse(String message) {}
}