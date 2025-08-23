package com.empresa.releasemanager.integration.azure;

import com.empresa.releasemanager.release.application.port.in.ReleaseUseCase;
import com.empresa.releasemanager.release.domain.model.Release;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.MultipartForm;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;

import java.io.IOException;
import java.io.InputStream;

@Path("/api/packages")
@Produces(MediaType.APPLICATION_JSON)
public class FileUploadResource {

    @Inject
    AzureBlobStorageClient storageClient;

    @Inject
    ReleaseUseCase releaseUseCase;

    @POST
    @Path("/upload/{productName}/{version}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @RolesAllowed({"release-manager", "pipeline"})
    public Response uploadPackage(
            @PathParam("productName") String productName,
            @PathParam("version") String version,
            @MultipartForm FileUploadForm form) {
        
        try {
            // Find the release
            Release release = releaseUseCase.findReleaseByProductAndVersion(productName, version)
                .orElseThrow(() -> new NotFoundException("Release not found: " + productName + " " + version));

            // Upload file to Azure Blob Storage
            String packageUrl = storageClient.uploadReleasePackage(
                productName, 
                version, 
                form.file, 
                form.fileName, 
                form.fileSize
            );

            // Update release with package URL
            // Note: We would need to add an updatePackageUrl method to the use case
            // For now, we'll return the URL
            
            return Response.ok(new UploadResponse(packageUrl, "Package uploaded successfully")).build();
            
        } catch (Exception e) {
            return Response.status(500)
                .entity(new ErrorResponse("Upload failed: " + e.getMessage()))
                .build();
        }
    }

    @GET
    @Path("/download/{productName}/{version}")
    @PermitAll // Public access for clients
    public Response getDownloadUrl(
            @PathParam("productName") String productName,
            @PathParam("version") String version) {
        
        try {
            Release release = releaseUseCase.findReleaseByProductAndVersion(productName, version)
                .orElseThrow(() -> new NotFoundException("Release not found"));

            if (release.getPackageUrl() == null || release.getPackageUrl().isEmpty()) {
                return Response.status(404)
                    .entity(new ErrorResponse("Package not available for this release"))
                    .build();
            }

            return Response.ok(new DownloadResponse(release.getPackageUrl())).build();
            
        } catch (NotFoundException e) {
            return Response.status(404).entity(new ErrorResponse(e.getMessage())).build();
        } catch (Exception e) {
            return Response.status(500).entity(new ErrorResponse("Error retrieving package")).build();
        }
    }

    public static class FileUploadForm {
        @RestForm("file")
        @PartType(MediaType.APPLICATION_OCTET_STREAM)
        public InputStream file;

        @RestForm("fileName")
        public String fileName;

        @RestForm("fileSize")
        public long fileSize;
    }

    public record UploadResponse(String packageUrl, String message) {}
    public record DownloadResponse(String downloadUrl) {}
    public record ErrorResponse(String message) {}
}