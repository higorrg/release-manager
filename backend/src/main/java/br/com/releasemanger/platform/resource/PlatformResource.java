package br.com.releasemanger.platform.resource;

import br.com.releasemanger.platform.model.entity.Platform;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

/**
 * Resource for managing platforms.
 */
@ResourceProperties(path = "platforms")
public interface PlatformResource extends PanacheEntityResource<Platform, Long> {
    // PanacheEntityResource provides all the CRUD operations automatically
}