package br.com.releasemanger.customer_environment_release.resource;

import br.com.releasemanger.customer_environment_release.model.entity.CustomerEnvironmentRelease;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

/**
 * Resource for managing customer environment releases.
 */
@ResourceProperties(path = "customer-environment-releases")
public interface CustomerEnvironmentReleaseResource extends PanacheEntityResource<CustomerEnvironmentRelease, Long> {
    // PanacheEntityResource provides all the CRUD operations automatically
}