package br.com.releasemanager.release.application.port.out;

import br.com.releasemanager.release.domain.model.ReleaseStatusHistory;

import java.util.List;

public interface ReleaseStatusHistoryRepository {
    
    ReleaseStatusHistory save(ReleaseStatusHistory statusHistory);
    
    List<ReleaseStatusHistory> findByReleaseId(Long releaseId);
    
    List<ReleaseStatusHistory> findByReleaseIdOrderByChangedAtDesc(Long releaseId);
    
    List<ReleaseStatusHistory> findAll();
}