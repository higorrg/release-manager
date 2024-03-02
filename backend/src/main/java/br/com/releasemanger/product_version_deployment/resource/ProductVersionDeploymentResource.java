package br.com.releasemanger.product_version_deployment.resource;

import br.com.releasemanger.product_version_deployment.model.entity.ProductVersionDeployment;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@ResourceProperties(path = "product/{productId}/version/{versionId}/deployment")
public interface ProductVersionDeploymentResource extends PanacheEntityResource<ProductVersionDeployment, Long> {

}
