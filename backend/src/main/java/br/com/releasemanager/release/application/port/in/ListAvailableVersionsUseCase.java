package br.com.releasemanager.release.application.port.in;

import java.util.List;

public interface ListAvailableVersionsUseCase {

    List<AvailableVersionResponse> listAvailableVersions(ListVersionsQuery query);
}
