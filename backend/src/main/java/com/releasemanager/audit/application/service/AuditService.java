package com.releasemanager.audit.application.service;

import com.releasemanager.audit.application.port.in.GetReleaseHistoryUseCase;
import com.releasemanager.audit.application.port.out.ReleaseStatusHistoryRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class AuditService implements GetReleaseHistoryUseCase {

    @Inject
    ReleaseStatusHistoryRepository releaseStatusHistoryRepository;

    @Override
    public List<HistoryEntry> getReleaseHistory(Long releaseId) {
        return releaseStatusHistoryRepository.findByReleaseIdOrderByChangedAtDesc(releaseId)
            .stream()
            .map(history -> new HistoryEntry(
                history.id,
                history.previousStatus != null ? history.previousStatus.getDisplayName() : null,
                history.newStatus.getDisplayName(),
                history.observation,
                history.changedBy,
                history.changedAt
            ))
            .toList();
    }
}