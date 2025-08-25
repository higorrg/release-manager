package com.empresa.app.releases.application.port.in;

import com.empresa.app.releases.domain.model.ReleaseHistory;
import com.empresa.app.releases.domain.model.ReleaseId;

import java.util.List;

public interface GetReleaseHistoryUseCase {
    
    List<ReleaseHistory> getHistoryByReleaseId(ReleaseId releaseId);
    
    List<ReleaseHistory> getAllHistory();
}