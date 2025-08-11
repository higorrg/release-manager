package com.releasemanager.application.port.in;

import com.releasemanager.domain.model.ReleaseId;
import com.releasemanager.domain.model.ReleaseStatus;

public interface UpdateReleaseStatusUseCase {
    void updateStatus(ReleaseId id, ReleaseStatus status);
}
