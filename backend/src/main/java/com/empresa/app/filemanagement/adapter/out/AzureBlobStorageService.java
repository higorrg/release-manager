package com.empresa.app.filemanagement.adapter.out;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.models.PublicAccessType;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.InputStream;
import java.util.UUID;
import java.util.logging.Logger;

@ApplicationScoped
public class AzureBlobStorageService {

    private static final Logger logger = Logger.getLogger(AzureBlobStorageService.class.getName());

    @ConfigProperty(name = "azure.storage.connection-string")
    String connectionString;

    @ConfigProperty(name = "azure.storage.container-name", defaultValue = "releases")
    String containerName;

    private BlobServiceClient blobServiceClient;
    private BlobContainerClient containerClient;

    @PostConstruct
    public void init() {
        if (connectionString == null || connectionString.trim().isEmpty()) {
            logger.warning("Azure Storage connection string not configured. File upload will not work.");
            return;
        }

        try {
            this.blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(connectionString)
                    .buildClient();

            this.containerClient = blobServiceClient.getBlobContainerClient(containerName);
            
            if (!containerClient.exists()) {
                // Criar container público para downloads diretos
                containerClient.createWithResponse(null, PublicAccessType.BLOB, null, null);
                logger.info("Created Azure Blob container: " + containerName + " with public access");
            }
            
            logger.info("Azure Blob Storage service initialized successfully");
        } catch (Exception e) {
            logger.severe("Failed to initialize Azure Blob Storage: " + e.getMessage());
            throw new RuntimeException("Failed to initialize Azure Blob Storage", e);
        }
    }

    public FileUploadResult uploadFile(String releaseId, String fileName, InputStream fileStream, String contentType) {
        if (containerClient == null) {
            throw new RuntimeException("Azure Blob Storage not properly initialized");
        }

        try {
            String blobName = generateBlobName(releaseId, fileName);
            BlobClient blobClient = containerClient.getBlobClient(blobName);

            BlobHttpHeaders headers = new BlobHttpHeaders()
                    .setContentType(contentType != null ? contentType : "application/octet-stream");

            blobClient.upload(fileStream, true);
            blobClient.setHttpHeaders(headers);
            
            // URL pública direta (sem assinatura)
            String downloadUrl = blobClient.getBlobUrl();
            
            logger.info("Successfully uploaded file: " + blobName + " for release: " + releaseId);
            
            return new FileUploadResult(downloadUrl, true, null);
            
        } catch (Exception e) {
            logger.severe("Failed to upload file to Azure Blob Storage: " + e.getMessage());
            return new FileUploadResult(null, false, "Upload failed: " + e.getMessage());
        }
    }

    public boolean deleteFile(String blobName) {
        if (containerClient == null) {
            return false;
        }

        try {
            BlobClient blobClient = containerClient.getBlobClient(blobName);
            blobClient.delete();
            logger.info("Successfully deleted file: " + blobName);
            return true;
        } catch (Exception e) {
            logger.severe("Failed to delete file from Azure Blob Storage: " + e.getMessage());
            return false;
        }
    }

    private String generateBlobName(String releaseId, String fileName) {
        String fileExtension = "";
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            fileExtension = fileName.substring(dotIndex);
        }
        
        String sanitizedFileName = fileName.replaceAll("[^a-zA-Z0-9.-]", "_");
        return String.format("releases/%s/%s_%s%s", 
                releaseId, 
                System.currentTimeMillis(), 
                sanitizedFileName,
                fileExtension.isEmpty() ? "" : ""
        );
    }


    public record FileUploadResult(
            String downloadUrl,
            boolean success,
            String errorMessage
    ) {}
}