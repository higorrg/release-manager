package com.releasemanager.storage.adapter.in;

import com.releasemanager.storage.application.port.in.ManagePackageStorageUseCase;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.InputStream;

@Path("/api/v1/packages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PackageStorageRestResource {

    @Inject
    ManagePackageStorageUseCase managePackageStorageUseCase;

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @RolesAllowed({"admin", "release-manager"})
    public Response uploadPackage(
        @FormParam("file") InputStream fileInputStream,
        @FormParam("fileName") String fileName,
        @FormParam("version") String version) {
        try {
            var contentType = fileName.endsWith(".zip") ? "application/zip" : "application/gzip";
            var command = new ManagePackageStorageUseCase.UploadPackageCommand(
                version,
                fileName,
                fileInputStream,
                contentType
            );

            var downloadUrl = managePackageStorageUseCase.uploadPackage(command);
            return Response.status(Response.Status.CREATED)
                .entity(new UploadResult(downloadUrl))
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Erro ao fazer upload: " + e.getMessage())
                .build();
        }
    }

    @GET
    @Path("/{version}")
    @RolesAllowed({"admin", "release-manager", "viewer"})
    public Response getPackageInfo(@PathParam("version") String version) {
        try {
            var packageInfo = managePackageStorageUseCase.getPackageInfo(version);
            return Response.ok(packageInfo).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(e.getMessage())
                .build();
        }
    }

    @GET
    @Path("/{version}/download")
    public Response getDownloadUrl(@PathParam("version") String version) {
        try {
            var downloadUrl = managePackageStorageUseCase.generateDownloadUrl(version);
            return Response.temporaryRedirect(java.net.URI.create(downloadUrl)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(e.getMessage())
                .build();
        }
    }

    @DELETE
    @Path("/{version}")
    @RolesAllowed({"admin", "release-manager"})
    public Response deletePackage(@PathParam("version") String version) {
        try {
            managePackageStorageUseCase.deletePackage(version);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Erro ao deletar pacote: " + e.getMessage())
                .build();
        }
    }

    public record UploadResult(String downloadUrl) {}
}