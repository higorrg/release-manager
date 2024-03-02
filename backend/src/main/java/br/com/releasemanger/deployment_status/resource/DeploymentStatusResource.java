package br.com.releasemanger.deployment_status.resource;

import br.com.releasemanger.deployment_status.model.entity.DeploymentStatus;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@ResourceProperties(path = "deployment-status")
public interface DeploymentStatusResource extends PanacheEntityResource<DeploymentStatus, Long> {

}
