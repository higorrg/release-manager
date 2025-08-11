package com.releasemanager.application.port.in;

import com.releasemanager.domain.model.ReleaseClient;
import com.releasemanager.domain.model.ReleaseId;

public interface AddClientToReleaseUseCase {
    void addClient(ReleaseId id, ReleaseClient client);
}
