package com.empresa.app.releases.application.port.in;

import com.empresa.app.clients.domain.model.ClientCode;
import com.empresa.app.releases.domain.model.ReleaseId;
import com.empresa.app.shared.domain.Environment;

import java.io.InputStream;

public interface DownloadReleasePackageUseCase {
    
    PackageDownload downloadPackage(DownloadPackageQuery query);
    
    record DownloadPackageQuery(
        ReleaseId releaseId,
        ClientCode clientCode,
        Environment environment
    ) {}
    
    record PackageDownload(
        String fileName,
        String contentType,
        long size,
        InputStream inputStream
    ) {}
}