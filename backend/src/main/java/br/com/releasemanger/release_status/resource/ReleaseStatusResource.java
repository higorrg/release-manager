package br.com.releasemanger.release_status.resource;

import br.com.releasemanger.release_status.model.entity.ReleaseStatus;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

/**
 * Resource for managing release statuses.
 */
@ResourceProperties(path = "release-status")
public interface ReleaseStatusResource extends PanacheEntityResource<ReleaseStatus, Long> {
    // PanacheEntityResource provides all the CRUD operations automatically
}
