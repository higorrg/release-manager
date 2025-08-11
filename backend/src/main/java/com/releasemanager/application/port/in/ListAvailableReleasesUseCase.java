package com.releasemanager.application.port.in;

import com.releasemanager.domain.model.Environment;
import com.releasemanager.domain.model.Release;

import java.util.List;

public interface ListAvailableReleasesUseCase {
    List<Release> listAvailable(String clientCode, Environment environment);
}
