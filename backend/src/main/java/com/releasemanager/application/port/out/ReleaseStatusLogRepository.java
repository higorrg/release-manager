package com.releasemanager.application.port.out;

import com.releasemanager.domain.model.ReleaseStatusLog;

public interface ReleaseStatusLogRepository {
    void log(ReleaseStatusLog log);
}
