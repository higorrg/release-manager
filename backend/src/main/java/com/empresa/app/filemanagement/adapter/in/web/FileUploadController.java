package com.empresa.app.filemanagement.adapter.in.web;

import com.empresa.app.filemanagement.application.port.in.FileUploadUseCase;
import com.empresa.app.releasemanagement.adapter.in.dto.ReleaseResponse;
import com.empresa.app.releasemanagement.application.port.in.ReleaseUseCase;
import com.empresa.app.releasemanagement.domain.model.Release;
import com.empresa.app.product.application.port.out.ProductRepository;
import com.empresa.app.product.domain.model.Product;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Optional;
import java.util.UUID;

@Path("/api/v1/files")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "File Management", description = "Operações de upload de arquivos")
@RolesAllowed({"user", "admin"})
public class FileUploadController {

    @Inject
    FileUploadUseCase fileUploadUseCase;
    
    @Inject
    ReleaseUseCase releaseUseCase;
    
    @Inject
    ProductRepository productRepository;

    @POST
    @Path("/releases/{releaseId}/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Upload de pacote por ID", description = "Faz upload do pacote de instalação para o Azure Blob Storage usando ID da release")
    @RolesAllowed("admin")
    public Response uploadPackage(@PathParam("releaseId") String releaseId,
                                @RestForm FileUpload file) {
        try {
            if (file == null || file.uploadedFile() == null) {
                throw new IllegalArgumentException("Arquivo é obrigatório");
            }

            UUID id = UUID.fromString(releaseId);
            
            String contentType = file.contentType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = "application/octet-stream";
            }
            
            long fileSize = Files.size(file.uploadedFile());
            
            var command = new FileUploadUseCase.UploadPackageCommand(
                id,
                file.fileName(),
                Files.newInputStream(file.uploadedFile()),
                contentType,
                fileSize
            );
            
            Release release = fileUploadUseCase.uploadReleasePackage(command);
            ReleaseResponse response = mapToResponse(release);
            
            return Response.ok(response).build();
            
        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar arquivo: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload: " + e.getMessage(), e);
        }
    }

    @POST
    @Path("/releases/upload/{productName}/{version}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Upload de pacote por versão", description = "Faz upload do pacote de instalação usando nome do produto e versão")
    @RolesAllowed("admin")
    public Response uploadPackageByVersion(@PathParam("productName") String productName,
                                         @PathParam("version") String version,
                                         @RestForm FileUpload file) {
        try {
            if (file == null || file.uploadedFile() == null) {
                throw new IllegalArgumentException("Arquivo é obrigatório");
            }

            // Buscar release por produto e versão
            Optional<Release> releaseOpt = releaseUseCase.findByProductNameAndVersion(productName, version);
            if (releaseOpt.isEmpty()) {
                throw new IllegalArgumentException("Release não encontrada para produto '" + productName + "' versão '" + version + "'");
            }

            Release existingRelease = releaseOpt.get();
            
            String contentType = file.contentType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = "application/octet-stream";
            }
            
            long fileSize = Files.size(file.uploadedFile());
            
            var command = new FileUploadUseCase.UploadPackageCommand(
                existingRelease.getId(),
                file.fileName(),
                Files.newInputStream(file.uploadedFile()),
                contentType,
                fileSize
            );
            
            Release release = fileUploadUseCase.uploadReleasePackage(command);
            ReleaseResponse response = mapToResponse(release);
            
            return Response.ok(response).build();
            
        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar arquivo: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload: " + e.getMessage(), e);
        }
    }

    private ReleaseResponse mapToResponse(Release release) {
        Product product = productRepository.findById(release.getProductId()).orElse(null);
        return ReleaseResponse.from(release, product);
    }
}