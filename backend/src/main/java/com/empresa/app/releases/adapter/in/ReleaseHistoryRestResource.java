package com.empresa.app.releases.adapter.in;

import com.empresa.app.releases.application.port.in.GetReleaseHistoryUseCase;
import com.empresa.app.releases.domain.model.ReleaseHistory;
import com.empresa.app.releases.domain.model.ReleaseId;
import com.empresa.app.shared.domain.ReleaseStatus;
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
import java.util.UUID;
import java.util.stream.Collectors;

@Path("/api/v1/releases/{releaseId}/history")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Release History", description = "Release history operations")
public class ReleaseHistoryRestResource {
    
    private final GetReleaseHistoryUseCase getReleaseHistoryUseCase;
    
    @Inject
    public ReleaseHistoryRestResource(GetReleaseHistoryUseCase getReleaseHistoryUseCase) {
        this.getReleaseHistoryUseCase = Objects.requireNonNull(getReleaseHistoryUseCase);
    }
    
    @GET
    @Operation(summary = "Get release history")
    public Response getHistory(@PathParam("releaseId") @Parameter(description = "Release ID") String releaseId) {
        try {
            var id = new ReleaseId(UUID.fromString(releaseId));
            
            var history = getReleaseHistoryUseCase.getHistoryByReleaseId(id);
            
            var response = history.stream()
                    .map(ReleaseHistoryResponse::fromDomain)
                    .collect(Collectors.toList());
            
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Invalid release ID format")).build();
        }
    }
    
    public static record ReleaseHistoryResponse(
            String id,
            String releaseId,
            String changedBy,
            String previousStatus,
            String previousStatusDisplayName,
            String newStatus,
            String newStatusDisplayName,
            String observation,
            LocalDateTime timestamp
    ) {
        public static ReleaseHistoryResponse fromDomain(ReleaseHistory history) {
            return new ReleaseHistoryResponse(
                    history.getId().toString(),
                    history.getReleaseId().toString(),
                    history.getChangedBy().toString(),
                    history.getPreviousStatus() != null ? history.getPreviousStatus().name() : null,
                    history.getPreviousStatus() != null ? history.getPreviousStatus().getDisplayName() : null,
                    history.getNewStatus().name(),
                    history.getNewStatus().getDisplayName(),
                    history.getObservation(),
                    history.getTimestamp()
            );
        }
    }
    
    public static record ErrorResponse(String message) {}
}

@Path("/api/v1/history")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Release History", description = "Release history operations")
class AllReleaseHistoryRestResource {
    
    private final GetReleaseHistoryUseCase getReleaseHistoryUseCase;
    
    @Inject
    public AllReleaseHistoryRestResource(GetReleaseHistoryUseCase getReleaseHistoryUseCase) {
        this.getReleaseHistoryUseCase = Objects.requireNonNull(getReleaseHistoryUseCase);
    }
    
    @GET
    @Operation(summary = "Get all releases history")
    public Response getAllHistory() {
        var history = getReleaseHistoryUseCase.getAllHistory();
        
        var response = history.stream()
                .map(ReleaseHistoryRestResource.ReleaseHistoryResponse::fromDomain)
                .collect(Collectors.toList());
        
        return Response.ok(response).build();
    }
}