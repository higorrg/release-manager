package com.releasemanager.releases.adapter.in;

import com.releasemanager.releases.application.port.in.CreateReleaseUseCase;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/pipeline/v1/releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PipelineIntegrationRestResource {

    @Inject
    CreateReleaseUseCase createReleaseUseCase;

    public record PipelineReleaseRequest(String productName, String version) {}

    @POST
    public Response createReleaseFromPipeline(PipelineReleaseRequest request) {
        var command = new CreateReleaseUseCase.CreateReleaseCommand(
            request.productName(), 
            request.version()
        );
        
        var result = createReleaseUseCase.createRelease(command);
        return Response.status(Response.Status.CREATED).entity(result).build();
    }
}