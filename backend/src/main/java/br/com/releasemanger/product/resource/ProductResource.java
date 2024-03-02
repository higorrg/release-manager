package br.com.releasemanger.product.resource;

import br.com.releasemanger.product.model.entity.Product;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@ResourceProperties(path = "products")
public interface ProductResource extends PanacheEntityResource<Product, Long> {

}
