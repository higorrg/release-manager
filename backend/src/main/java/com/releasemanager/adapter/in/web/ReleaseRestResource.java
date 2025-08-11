package com.releasemanager.adapter.in.web;

import com.releasemanager.application.port.in.AddClientToReleaseUseCase;
import com.releasemanager.application.port.in.ListAvailableReleasesUseCase;
import com.releasemanager.application.port.in.RegisterReleaseUseCase;
import com.releasemanager.application.port.in.UpdateReleaseStatusUseCase;
import com.releasemanager.domain.model.Environment;
import com.releasemanager.domain.model.Release;
import com.releasemanager.domain.model.ReleaseClient;
import com.releasemanager.domain.model.ReleaseId;
import com.releasemanager.domain.model.ReleaseStatus;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;

import java.util.List;
import java.util.UUID;

@Path("/releases")
public class ReleaseRestResource {

    @Inject RegisterReleaseUseCase registerReleaseUseCase;
    @Inject UpdateReleaseStatusUseCase updateReleaseStatusUseCase;
    @Inject AddClientToReleaseUseCase addClientToReleaseUseCase;
    @Inject ListAvailableReleasesUseCase listAvailableReleasesUseCase;

    @POST
    public Response register(RegisterReleaseRequest request) {
        Release release = registerReleaseUseCase.register(request.productName(), request.version());
        return Response.status(Response.Status.CREATED).entity(release).build();
    }

    @PUT
    @Path("/{id}/status")
    public Response updateStatus(@RestPath String id, UpdateStatusRequest request) {
        updateReleaseStatusUseCase.updateStatus(new ReleaseId(UUID.fromString(id)), request.status());
        return Response.noContent().build();
    }

    @POST
    @Path("/{id}/clients")
    public Response addClient(@RestPath String id, AddClientRequest request) {
        addClientToReleaseUseCase.addClient(new ReleaseId(UUID.fromString(id)), new ReleaseClient(request.clientCode(), request.environment()));
        return Response.noContent().build();
    }

    @GET
    @Path("/available")
    public List<Release> listAvailable(@RestQuery String clientCode, @RestQuery Environment environment) {
        return listAvailableReleasesUseCase.listAvailable(clientCode, environment);
    }
}

record RegisterReleaseRequest(String productName, String version) {}
record UpdateStatusRequest(ReleaseStatus status) {}
record AddClientRequest(String clientCode, Environment environment) {}
