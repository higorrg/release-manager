package com.empresa.app.config;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Map;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {
        if (exception instanceof IllegalArgumentException) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", exception.getMessage()))
                    .build();
        }
        
        if (exception instanceof RuntimeException) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("message", "Internal server error"))
                    .build();
        }
        
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("message", "An unexpected error occurred"))
                .build();
    }
}