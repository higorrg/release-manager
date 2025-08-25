package com.empresa.app.releases.application.port.in;

import com.empresa.app.releases.domain.model.ProductName;
import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.releases.domain.model.ReleaseVersion;

public interface CreateReleaseUseCase {
    
    Release create(CreateReleaseCommand command);
    
    record CreateReleaseCommand(
        ProductName productName,
        ReleaseVersion version,
        String releaseNotes,
        String prerequisites,
        String downloadUrl
    ) {}
}