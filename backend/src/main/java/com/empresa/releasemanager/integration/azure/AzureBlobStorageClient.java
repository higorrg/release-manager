package com.empresa.releasemanager.integration.azure;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@ApplicationScoped
public class AzureBlobStorageClient {

    @Inject
    @ConfigProperty(name = "azure.storage.account-name")
    String accountName;

    @Inject
    @ConfigProperty(name = "azure.storage.account-key")
    String accountKey;

    @Inject
    @ConfigProperty(name = "azure.storage.container-name")
    String containerName;

    private BlobServiceClient blobServiceClient;
    private BlobContainerClient containerClient;

    public void init() {
        if (blobServiceClient == null) {
            String endpoint = String.format("https://%s.blob.core.windows.net", accountName);
            
            blobServiceClient = new BlobServiceClientBuilder()
                .endpoint(endpoint)
                .credential(new com.azure.storage.common.StorageSharedKeyCredential(accountName, accountKey))
                .buildClient();
            
            containerClient = blobServiceClient.getBlobContainerClient(containerName);
            
            // Create container if it doesn't exist
            if (!containerClient.exists()) {
                containerClient.create();
            }
        }
    }

    public String uploadReleasePackage(String productName, String version, InputStream fileData, 
                                     String fileName, long fileSize) {
        init();
        
        // Generate a unique blob name with timestamp
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String blobName = String.format("releases/%s/%s/%s_%s", 
            productName.toLowerCase().replace(" ", "-"), 
            version, 
            timestamp, 
            fileName);

        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Set appropriate content type based on file extension
        BlobHttpHeaders headers = new BlobHttpHeaders();
        if (fileName.endsWith(".zip")) {
            headers.setContentType("application/zip");
        } else if (fileName.endsWith(".tar.gz") || fileName.endsWith(".tgz")) {
            headers.setContentType("application/gzip");
        } else {
            headers.setContentType("application/octet-stream");
        }

        // Upload the file
        blobClient.upload(fileData, fileSize, true);
        blobClient.setHttpHeaders(headers);

        // Return the blob URL
        return blobClient.getBlobUrl();
    }

    public Optional<String> generateDownloadUrl(String blobName) {
        init();
        
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        
        if (blobClient.exists()) {
            return Optional.of(blobClient.getBlobUrl());
        }
        
        return Optional.empty();
    }

    public boolean deleteBlob(String blobName) {
        init();
        
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        return blobClient.deleteIfExists();
    }

    public boolean blobExists(String blobName) {
        init();
        
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        return blobClient.exists();
    }
}