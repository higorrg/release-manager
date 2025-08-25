package com.empresa.app.releases.application.service;

import com.empresa.app.releases.application.port.in.GetReleaseHistoryUseCase;
import com.empresa.app.releases.application.port.out.ReleaseHistoryRepository;
import com.empresa.app.releases.domain.model.ReleaseHistory;
import com.empresa.app.releases.domain.model.ReleaseId;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class GetReleaseHistoryService implements GetReleaseHistoryUseCase {
    
    private final ReleaseHistoryRepository releaseHistoryRepository;
    
    @Inject
    public GetReleaseHistoryService(ReleaseHistoryRepository releaseHistoryRepository) {
        this.releaseHistoryRepository = Objects.requireNonNull(releaseHistoryRepository, "ReleaseHistoryRepository cannot be null");
    }
    
    @Override
    public List<ReleaseHistory> getHistoryByReleaseId(ReleaseId releaseId) {
        Objects.requireNonNull(releaseId, "ReleaseId cannot be null");
        
        return releaseHistoryRepository.findByReleaseIdOrderByTimestampDesc(releaseId);
    }
    
    @Override
    public List<ReleaseHistory> getAllHistory() {
        return releaseHistoryRepository.findAll();
    }
}