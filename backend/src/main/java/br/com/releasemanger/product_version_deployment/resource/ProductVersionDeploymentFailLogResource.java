package br.com.releasemanger.product_version_deployment.resource;

import br.com.releasemanger.product_version_deployment.model.entity.ProductVersionDeploymentFailLog;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@ResourceProperties(path = "product/{productId}/version/{versionId}/deployment/{deploymentId}")
public interface ProductVersionDeploymentFailLogResource
		extends PanacheEntityResource<ProductVersionDeploymentFailLog, Long> {

}
