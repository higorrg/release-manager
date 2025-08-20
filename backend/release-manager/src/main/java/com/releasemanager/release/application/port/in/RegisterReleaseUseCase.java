package com.releasemanager.release.application.port.in;

import com.releasemanager.release.domain.model.Release;

public interface RegisterReleaseUseCase {
    Release register(RegisterReleaseCommand command);
}
