package br.com.releasemanager.release.application.port.in;

import br.com.releasemanager.release.domain.model.Release;

public interface ChangeReleaseStatusUseCase {

    Release changeStatus(ChangeStatusCommand command);
}
