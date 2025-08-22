package com.releasemanager.audit.application.port.out;

import com.releasemanager.audit.domain.model.ReleaseStatusHistory;
import java.util.List;

public interface ReleaseStatusHistoryRepository {
    
    ReleaseStatusHistory save(ReleaseStatusHistory history);
    List<ReleaseStatusHistory> findByReleaseId(Long releaseId);
    List<ReleaseStatusHistory> findByReleaseIdOrderByChangedAtDesc(Long releaseId);
}