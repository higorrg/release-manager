package com.releasemanager.audit.adapter.in;

import com.releasemanager.audit.application.port.in.GetReleaseHistoryUseCase;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/v1/audit")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuditRestResource {

    @Inject
    GetReleaseHistoryUseCase getReleaseHistoryUseCase;

    @GET
    @Path("/releases/{releaseId}/history")
    @RolesAllowed({"admin", "release-manager", "viewer"})
    public Response getReleaseHistory(@PathParam("releaseId") Long releaseId) {
        var history = getReleaseHistoryUseCase.getReleaseHistory(releaseId);
        return Response.ok(history).build();
    }
}