package com.releasemanager.history.application.port.out;

import com.releasemanager.history.domain.model.ReleaseStatusHistory;

public interface ReleaseStatusHistoryRepository {

    void save(ReleaseStatusHistory history);

}
