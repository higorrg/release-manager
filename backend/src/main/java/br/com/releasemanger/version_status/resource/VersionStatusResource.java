package br.com.releasemanger.version_status.resource;

import br.com.releasemanger.version_status.model.entity.VersionStatus;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@ResourceProperties(path = "version-status")
public interface VersionStatusResource extends PanacheEntityResource<VersionStatus, Long> {

}
