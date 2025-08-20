package com.releasemanager.release.adapter.in.web;

import com.releasemanager.release.application.port.in.RegisterReleaseCommand;
import com.releasemanager.release.application.port.in.RegisterReleaseUseCase;
import com.releasemanager.release.domain.model.Release;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;

@Path("/api/v1/releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReleaseResource {

    private final RegisterReleaseUseCase registerReleaseUseCase;

    @Inject
    public ReleaseResource(RegisterReleaseUseCase registerReleaseUseCase) {
        this.registerReleaseUseCase = registerReleaseUseCase;
    }

    @POST
    public Response registerRelease(@Valid RegisterReleaseCommand command) {
        Release registeredRelease = registerReleaseUseCase.register(command);
        return Response.created(URI.create("/api/v1/releases/" + registeredRelease.getId()))
                       .entity(registeredRelease)
                       .build();
    }
}
