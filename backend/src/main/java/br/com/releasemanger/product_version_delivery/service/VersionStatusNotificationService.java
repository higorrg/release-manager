package br.com.releasemanger.product_version_delivery.service;

import static br.com.releasemanger.version_status.model.vo.VersionStatusNotificationChannel.VERSION_STATUS_NOTIFICATION;

import br.com.releasemanger.product_version_delivery.model.vo.NewProductVersionDeliveryOutputDTO;
import io.vertx.core.eventbus.EventBus;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;

@Dependent
public class VersionStatusNotificationService {

	@Inject
	private EventBus bus;

	public void publish(NewProductVersionDeliveryOutputDTO version) {
		bus.publish(VERSION_STATUS_NOTIFICATION, version);
	}

}
