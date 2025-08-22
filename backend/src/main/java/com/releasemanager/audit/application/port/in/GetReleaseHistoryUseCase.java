package com.releasemanager.audit.application.port.in;

import java.time.ZonedDateTime;
import java.util.List;

public interface GetReleaseHistoryUseCase {
    
    record HistoryEntry(
        Long id,
        String previousStatus,
        String newStatus,
        String observation,
        String changedBy,
        ZonedDateTime changedAt
    ) {}
    
    List<HistoryEntry> getReleaseHistory(Long releaseId);
}