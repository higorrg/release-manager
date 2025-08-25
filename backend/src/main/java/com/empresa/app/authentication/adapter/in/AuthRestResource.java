package com.empresa.app.authentication.adapter.in;

import com.empresa.app.authentication.application.port.in.AuthenticateUserUseCase;
import com.empresa.app.authentication.application.port.in.CreateUserUseCase;
import com.empresa.app.authentication.domain.model.Email;
import com.empresa.app.authentication.domain.model.Password;
import com.empresa.app.shared.domain.UserRole;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.Objects;

@Path("/api/v1/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Authentication", description = "Authentication operations")
public class AuthRestResource {
    
    private final CreateUserUseCase createUserUseCase;
    private final AuthenticateUserUseCase authenticateUserUseCase;
    
    @Inject
    public AuthRestResource(CreateUserUseCase createUserUseCase,
                           AuthenticateUserUseCase authenticateUserUseCase) {
        this.createUserUseCase = Objects.requireNonNull(createUserUseCase);
        this.authenticateUserUseCase = Objects.requireNonNull(authenticateUserUseCase);
    }
    
    @POST
    @Path("/register")
    @Operation(summary = "Register new user")
    public Response register(@Valid RegisterRequest request) {
        try {
            var command = new CreateUserUseCase.CreateUserCommand(
                new Email(request.email),
                new Password(request.password),
                new Password(request.confirmPassword),
                UserRole.READ_ONLY  // Default role
            );
            
            var user = createUserUseCase.create(command);
            
            var response = new UserResponse(
                user.getId().toString(),
                user.getEmail().toString(),
                user.getRole().getValue(),
                user.isActive()
            );
            
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    @POST
    @Path("/login")
    @Operation(summary = "Authenticate user")
    public Response login(@Valid LoginRequest request) {
        try {
            var command = new AuthenticateUserUseCase.AuthenticateCommand(
                new Email(request.email),
                new Password(request.password)
            );
            
            var token = authenticateUserUseCase.authenticate(command);
            
            return Response.ok(new TokenResponse(token)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    public static record RegisterRequest(
        @NotBlank String email,
        @NotBlank String password,
        @NotBlank String confirmPassword
    ) {}
    
    public static record LoginRequest(
        @NotBlank String email,
        @NotBlank String password
    ) {}
    
    public static record UserResponse(
        String id,
        String email,
        String role,
        boolean active
    ) {}
    
    public static record TokenResponse(String token) {}
    
    public static record ErrorResponse(String message) {}
}