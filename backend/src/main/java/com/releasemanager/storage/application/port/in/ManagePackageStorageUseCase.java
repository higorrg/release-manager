package com.releasemanager.storage.application.port.in;

import java.io.InputStream;

public interface ManagePackageStorageUseCase {
    
    record UploadPackageCommand(
        String releaseVersion,
        String fileName,
        InputStream fileContent,
        String contentType
    ) {}
    
    record PackageInfo(
        String fileName,
        String downloadUrl,
        long fileSize,
        String contentType
    ) {}
    
    String uploadPackage(UploadPackageCommand command);
    PackageInfo getPackageInfo(String releaseVersion);
    void deletePackage(String releaseVersion);
    String generateDownloadUrl(String releaseVersion);
}