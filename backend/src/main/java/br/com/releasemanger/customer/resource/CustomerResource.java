package br.com.releasemanger.customer.resource;

import br.com.releasemanger.customer.model.entity.Customer;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@ResourceProperties(path = "customer")
public interface CustomerResource extends PanacheEntityResource<Customer, Long> {

}
