package com.empresa.app.releases.application.port.in;

import com.empresa.app.clients.domain.model.ClientCode;
import com.empresa.app.releases.domain.model.ReleaseClientEnvironment;
import com.empresa.app.releases.domain.model.ReleaseId;
import com.empresa.app.shared.domain.Environment;

import java.util.List;

public interface GetReleaseClientsUseCase {
    
    List<ReleaseClientEnvironment> getReleaseClients(ReleaseId releaseId);
    
    List<ReleaseClientEnvironment> getClientReleases(ClientCode clientCode, Environment environment);
}