package com.releasemanager.application.port.in;

import com.releasemanager.domain.model.Release;

public interface RegisterReleaseUseCase {
    Release register(String productName, String version);
}
