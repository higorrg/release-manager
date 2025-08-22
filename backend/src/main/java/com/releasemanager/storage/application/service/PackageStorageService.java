package com.releasemanager.storage.application.service;

import com.releasemanager.storage.application.port.in.ManagePackageStorageUseCase;
import com.releasemanager.storage.application.port.out.BlobStorageRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class PackageStorageService implements ManagePackageStorageUseCase {

    private static final String RELEASES_CONTAINER = "releases";

    @Inject
    BlobStorageRepository blobStorageRepository;

    @Override
    public String uploadPackage(UploadPackageCommand command) {
        var blobName = generateBlobName(command.releaseVersion(), command.fileName());
        return blobStorageRepository.uploadBlob(
            RELEASES_CONTAINER, 
            blobName, 
            command.fileContent(), 
            command.contentType()
        );
    }

    @Override
    public PackageInfo getPackageInfo(String releaseVersion) {
        var blobName = findBlobByVersion(releaseVersion);
        if (blobName == null) {
            throw new IllegalArgumentException("Pacote não encontrado para a versão: " + releaseVersion);
        }

        var blobInfo = blobStorageRepository.getBlobInfo(RELEASES_CONTAINER, blobName);
        return new PackageInfo(
            blobInfo.fileName(),
            blobInfo.url(),
            blobInfo.size(),
            blobInfo.contentType()
        );
    }

    @Override
    public void deletePackage(String releaseVersion) {
        var blobName = findBlobByVersion(releaseVersion);
        if (blobName != null) {
            blobStorageRepository.deleteBlob(RELEASES_CONTAINER, blobName);
        }
    }

    @Override
    public String generateDownloadUrl(String releaseVersion) {
        var blobName = findBlobByVersion(releaseVersion);
        if (blobName == null) {
            throw new IllegalArgumentException("Pacote não encontrado para a versão: " + releaseVersion);
        }
        return blobStorageRepository.generateDownloadUrl(RELEASES_CONTAINER, blobName);
    }

    private String generateBlobName(String releaseVersion, String fileName) {
        return String.format("%s/%s", releaseVersion, fileName);
    }

    private String findBlobByVersion(String releaseVersion) {
        var zipBlobName = generateBlobName(releaseVersion, releaseVersion + ".zip");
        var tarGzBlobName = generateBlobName(releaseVersion, releaseVersion + ".tar.gz");
        
        if (blobStorageRepository.blobExists(RELEASES_CONTAINER, zipBlobName)) {
            return zipBlobName;
        }
        if (blobStorageRepository.blobExists(RELEASES_CONTAINER, tarGzBlobName)) {
            return tarGzBlobName;
        }
        return null;
    }
}