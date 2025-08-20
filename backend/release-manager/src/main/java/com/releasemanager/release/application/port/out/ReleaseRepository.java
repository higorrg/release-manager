package com.releasemanager.release.application.port.out;

import com.releasemanager.release.domain.model.Release;
import java.util.Optional;

public interface ReleaseRepository {

    Release save(Release release);

    Optional<Release> findByProductNameAndVersion(String productName, String version);

}
