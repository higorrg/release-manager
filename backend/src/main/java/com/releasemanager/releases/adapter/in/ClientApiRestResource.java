package com.releasemanager.releases.adapter.in;

import com.releasemanager.releases.application.port.in.GetAvailableReleasesForClientUseCase;
import com.releasemanager.releases.domain.model.Environment;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/public/v1/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClientApiRestResource {

    @Inject
    GetAvailableReleasesForClientUseCase getAvailableReleasesForClientUseCase;

    @GET
    @Path("/{clientCode}/releases")
    public Response getAvailableReleases(
            @PathParam("clientCode") String clientCode,
            @QueryParam("environment") @DefaultValue("producao") String environment) {
        
        try {
            var env = Environment.fromValue(environment);
            var query = new GetAvailableReleasesForClientUseCase.ClientReleaseQuery(clientCode, env);
            var result = getAvailableReleasesForClientUseCase.getAvailableReleases(query);
            return Response.ok(result).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity("Ambiente inválido: " + environment)
                .build();
        }
    }
}