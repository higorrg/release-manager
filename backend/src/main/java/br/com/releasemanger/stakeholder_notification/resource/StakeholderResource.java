package br.com.releasemanger.stakeholder_notification.resource;

import br.com.releasemanger.stakeholder_notification.model.entity.Stakeholder;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@ResourceProperties(path = "stakeholder_notification")
public interface StakeholderResource extends PanacheEntityResource<Stakeholder, Long> {

}
