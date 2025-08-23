package com.empresa.releasemanager.integration;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDateTime;
import java.util.Map;

@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
public class HealthResource {

    @GET
    public Response health() {
        Map<String, Object> health = Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "service", "release-manager",
            "version", "1.0.0"
        );
        
        return Response.ok(health).build();
    }
}