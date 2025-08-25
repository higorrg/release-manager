package com.empresa.app.releases.application.port.in;

import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.releases.domain.model.ReleaseId;

import java.io.InputStream;

public interface UploadReleasePackageUseCase {
    
    Release uploadPackage(UploadPackageCommand command);
    
    record UploadPackageCommand(
        ReleaseId releaseId,
        String fileName,
        String contentType,
        long size,
        InputStream inputStream
    ) {}
}