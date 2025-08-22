package com.releasemanager.storage.adapter.out;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.releasemanager.storage.application.port.out.BlobStorageRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.io.IOException;
import java.io.InputStream;

@ApplicationScoped
public class AzureBlobStorageRepository implements BlobStorageRepository {

    @Inject
    BlobServiceClient blobServiceClient;

    @Override
    public String uploadBlob(String containerName, String blobName, InputStream content, String contentType) {
        var containerClient = blobServiceClient.getBlobContainerClient(containerName);
        var blobClient = containerClient.getBlobClient(blobName);

        var headers = new BlobHttpHeaders().setContentType(contentType);
        try {
            long contentLength = content.available();
            blobClient.uploadWithResponse(content, contentLength, null, headers, null, null, null, null, null);
        } catch (IOException e) {
            blobClient.upload(content, true);
            blobClient.setHttpHeaders(headers);
        }

        return blobClient.getBlobUrl();
    }

    @Override
    public BlobInfo getBlobInfo(String containerName, String blobName) {
        var containerClient = blobServiceClient.getBlobContainerClient(containerName);
        var blobClient = containerClient.getBlobClient(blobName);

        if (!blobClient.exists()) {
            throw new IllegalArgumentException("Blob não encontrado: " + blobName);
        }

        var properties = blobClient.getProperties();
        return new BlobInfo(
            blobName,
            blobClient.getBlobUrl(),
            properties.getBlobSize(),
            properties.getContentType()
        );
    }

    @Override
    public void deleteBlob(String containerName, String blobName) {
        var containerClient = blobServiceClient.getBlobContainerClient(containerName);
        var blobClient = containerClient.getBlobClient(blobName);
        blobClient.deleteIfExists();
    }

    @Override
    public String generateDownloadUrl(String containerName, String blobName) {
        var containerClient = blobServiceClient.getBlobContainerClient(containerName);
        var blobClient = containerClient.getBlobClient(blobName);
        return blobClient.getBlobUrl();
    }

    @Override
    public boolean blobExists(String containerName, String blobName) {
        var containerClient = blobServiceClient.getBlobContainerClient(containerName);
        var blobClient = containerClient.getBlobClient(blobName);
        return blobClient.exists();
    }
}