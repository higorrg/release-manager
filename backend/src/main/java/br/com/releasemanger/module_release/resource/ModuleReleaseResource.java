package br.com.releasemanger.module_release.resource;

import br.com.releasemanger.module_release.model.entity.ModuleRelease;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

/**
 * Resource for managing module releases.
 */
@ResourceProperties(path = "module-releases")
public interface ModuleReleaseResource extends PanacheEntityResource<ModuleRelease, Long> {
    // PanacheEntityResource provides all the CRUD operations automatically
}