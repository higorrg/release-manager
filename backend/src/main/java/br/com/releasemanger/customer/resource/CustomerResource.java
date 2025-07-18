package br.com.releasemanger.customer.resource;

import br.com.releasemanger.customer.model.entity.Customer;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

/**
 * Resource for managing customers.
 */
@ResourceProperties(path = "customers")
public interface CustomerResource extends PanacheEntityResource<Customer, Long> {
    // PanacheEntityResource provides all the CRUD operations automatically
}