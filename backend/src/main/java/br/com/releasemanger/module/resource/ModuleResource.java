package br.com.releasemanger.module.resource;

import br.com.releasemanger.module.model.entity.Module;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

/**
 * Resource for managing modules.
 */
@ResourceProperties(path = "modules")
public interface ModuleResource extends PanacheEntityResource<Module, Long> {
    // PanacheEntityResource provides all the CRUD operations automatically
}