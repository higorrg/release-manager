package com.empresa.app.releases.application.port.in;

import com.empresa.app.clients.domain.model.ClientCode;
import com.empresa.app.releases.domain.model.Release;
import com.empresa.app.shared.domain.Environment;

import java.util.List;

public interface GetAvailableReleasesForClientUseCase {
    
    List<Release> getAvailableReleases(GetAvailableReleasesQuery query);
    
    record GetAvailableReleasesQuery(
        ClientCode clientCode,
        Environment environment
    ) {}
}