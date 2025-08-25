package com.empresa.app.releases.adapter.in;

import com.empresa.app.clients.domain.model.ClientCode;
import com.empresa.app.releases.application.port.in.DownloadReleasePackageUseCase;
import com.empresa.app.releases.application.port.in.UploadReleasePackageUseCase;
import com.empresa.app.releases.domain.model.ReleaseId;
import com.empresa.app.shared.domain.Environment;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Objects;
import java.util.UUID;

@Path("/api/v1/releases/{releaseId}/packages")
@Tag(name = "Package Distribution", description = "Package upload and download operations")
public class PackageRestResource {
    
    private final UploadReleasePackageUseCase uploadReleasePackageUseCase;
    private final DownloadReleasePackageUseCase downloadReleasePackageUseCase;
    
    @Inject
    public PackageRestResource(UploadReleasePackageUseCase uploadReleasePackageUseCase,
                              DownloadReleasePackageUseCase downloadReleasePackageUseCase) {
        this.uploadReleasePackageUseCase = Objects.requireNonNull(uploadReleasePackageUseCase);
        this.downloadReleasePackageUseCase = Objects.requireNonNull(downloadReleasePackageUseCase);
    }
    
    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Upload release package")
    public Response uploadPackage(@PathParam("releaseId") @Parameter(description = "Release ID") String releaseId,
                                 FileUpload file) {
        try {
            if (file == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("No file provided")).build();
            }
            
            var inputStream = Files.newInputStream(file.uploadedFile());
            
            var command = new UploadReleasePackageUseCase.UploadPackageCommand(
                new ReleaseId(UUID.fromString(releaseId)),
                file.fileName(),
                file.contentType(),
                file.size(),
                inputStream
            );
            
            var release = uploadReleasePackageUseCase.uploadPackage(command);
            
            var response = new UploadResponse(
                "Package uploaded successfully",
                file.fileName(),
                file.size(),
                release.getDownloadUrl()
            );
            
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Failed to process file upload")).build();
        }
    }
    
    @GET
    @Path("/download")
    @Operation(summary = "Download release package")
    public Response downloadPackage(@PathParam("releaseId") @Parameter(description = "Release ID") String releaseId,
                                   @QueryParam("clientCode") @Parameter(description = "Client code", required = true) String clientCode,
                                   @QueryParam("environment") @Parameter(description = "Environment", required = true) String environment) {
        
        if (clientCode == null || clientCode.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Client code is required")).build();
        }
        
        if (environment == null || environment.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Environment is required")).build();
        }
        
        try {
            var query = new DownloadReleasePackageUseCase.DownloadPackageQuery(
                new ReleaseId(UUID.fromString(releaseId)),
                new ClientCode(clientCode.trim()),
                Environment.valueOf(environment.trim().toUpperCase())
            );
            
            var packageDownload = downloadReleasePackageUseCase.downloadPackage(query);
            
            StreamingOutput stream = output -> {
                try (var inputStream = packageDownload.inputStream()) {
                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        output.write(buffer, 0, bytesRead);
                    }
                }
            };
            
            return Response.ok(stream)
                    .header("Content-Disposition", "attachment; filename=\"" + packageDownload.fileName() + "\"")
                    .header("Content-Type", packageDownload.contentType())
                    .header("Content-Length", packageDownload.size())
                    .build();
                    
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage())).build();
        }
    }
    
    // DTOs
    public static record UploadResponse(
        String message,
        String fileName,
        long size,
        String downloadUrl
    ) {}
    
    public static record ErrorResponse(String message) {}
}