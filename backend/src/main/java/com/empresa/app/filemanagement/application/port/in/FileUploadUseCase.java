package com.empresa.app.filemanagement.application.port.in;

import com.empresa.app.releasemanagement.domain.model.Release;

import java.io.InputStream;
import java.util.UUID;

public interface FileUploadUseCase {

    Release uploadReleasePackage(UploadPackageCommand command);

    record UploadPackageCommand(
            UUID releaseId,
            String fileName,
            InputStream fileStream,
            String contentType,
            long fileSize
    ) {}

    record FileUploadResult(
            String downloadUrl,
            String packagePath,
            boolean success,
            String errorMessage
    ) {}
}