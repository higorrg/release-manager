package com.releasemanager.application.port.out;

import com.releasemanager.domain.model.Environment;
import com.releasemanager.domain.model.Release;
import com.releasemanager.domain.model.ReleaseClient;
import com.releasemanager.domain.model.ReleaseId;
import com.releasemanager.domain.model.ReleaseStatus;

import java.util.List;
import java.util.Optional;

public interface ReleaseRepository {
    Release save(Release release);
    Optional<Release> findById(ReleaseId id);
    void updateStatus(ReleaseId id, ReleaseStatus status);
    void addClient(ReleaseId id, ReleaseClient client);
    List<Release> findAvailableByClientAndEnvironment(String clientCode, Environment environment);
}
