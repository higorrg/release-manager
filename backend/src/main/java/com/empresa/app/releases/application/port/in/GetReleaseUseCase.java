package com.empresa.app.releases.application.port.in;

import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.releases.domain.model.ReleaseId;

import java.util.Optional;

public interface GetReleaseUseCase {
    
    Optional<Release> getById(ReleaseId releaseId);
}