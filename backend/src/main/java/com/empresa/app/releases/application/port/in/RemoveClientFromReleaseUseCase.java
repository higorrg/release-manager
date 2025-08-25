package com.empresa.app.releases.application.port.in;

import com.empresa.app.clients.domain.model.ClientCode;
import com.empresa.app.releases.domain.model.ReleaseId;
import com.empresa.app.shared.domain.Environment;

public interface RemoveClientFromReleaseUseCase {
    
    void removeClientFromRelease(RemoveClientCommand command);
    
    record RemoveClientCommand(
        ReleaseId releaseId,
        ClientCode clientCode,
        Environment environment
    ) {}
}