package com.releasemanager.storage.application.port.out;

import java.io.InputStream;

public interface BlobStorageRepository {
    
    record BlobInfo(
        String fileName,
        String url,
        long size,
        String contentType
    ) {}
    
    String uploadBlob(String containerName, String blobName, InputStream content, String contentType);
    BlobInfo getBlobInfo(String containerName, String blobName);
    void deleteBlob(String containerName, String blobName);
    String generateDownloadUrl(String containerName, String blobName);
    boolean blobExists(String containerName, String blobName);
}