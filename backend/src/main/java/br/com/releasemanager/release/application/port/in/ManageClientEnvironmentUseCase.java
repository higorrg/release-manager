package br.com.releasemanager.release.application.port.in;

import br.com.releasemanager.release.domain.model.ReleaseClientEnvironment;

import java.util.List;

public interface ManageClientEnvironmentUseCase {

    ReleaseClientEnvironment addClientEnvironment(AddClientEnvironmentCommand command);

    void removeClientEnvironment(RemoveClientEnvironmentCommand command);

    List<ReleaseClientEnvironment> getClientEnvironmentsByRelease(Long releaseId);
}
