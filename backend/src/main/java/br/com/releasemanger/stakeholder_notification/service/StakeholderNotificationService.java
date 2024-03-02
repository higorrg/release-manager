package br.com.releasemanger.stakeholder_notification.service;

import static br.com.releasemanger.version_status.model.vo.VersionStatusNotificationChannel.VERSION_STATUS_NOTIFICATION;
import static br.com.releasemanger.version_status.model.vo.VersionStatusNotificationChannel.VERSION_STATUS_NOTIFICATION_SSE;

import java.time.LocalDateTime;
import java.util.List;

import br.com.releasemanger.product_version_delivery.model.vo.NewProductVersionDeliveryOutputDTO;
import br.com.releasemanger.stakeholder_notification.model.entity.Stakeholder;
import br.com.releasemanger.stakeholder_notification.model.vo.StakeholderNotificationDTO;
import io.quarkus.vertx.ConsumeEvent;
import io.smallrye.common.annotation.Blocking;
import io.vertx.core.eventbus.EventBus;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;

@Dependent
@Slf4j
public class StakeholderNotificationService {

	@Inject
	private EventBus bus;

	@ConsumeEvent(VERSION_STATUS_NOTIFICATION)
	@Blocking
	public void consume(NewProductVersionDeliveryOutputDTO version) {
		List<Stakeholder> stakeholders = Stakeholder.listAll();
		if (stakeholders.size() == 0) {
			log.info("No Stakeholders to notify");
		}
		stakeholders.stream()
				.filter(stakeholder -> stakeholder.getVersionStatuses().stream()
						.anyMatch(vs -> vs.getId().equals(version.versionStatusId())))
				.forEach(stakeholder -> {
					this.sendStakeholderNotification(stakeholder, version);
				});
	}

	public void sendStakeholderNotification(Stakeholder stakeholder, NewProductVersionDeliveryOutputDTO version) {
		StakeholderNotificationDTO stakeholderNotificationDto = StakeholderNotificationDTO.builder()
				.stakeholderName(stakeholder.getName())
				.stakeholderRole(stakeholder.getStakeholderRole())
				.stakeholderEmail(stakeholder.getEmail())
				.notificationTime(LocalDateTime.now())
				.message("Product %s version %s was promoted to %s"
						.formatted(version.productName(),
								version.versionString(),
								version.versionStatusName()))
				.build();
		bus.publish(VERSION_STATUS_NOTIFICATION_SSE, stakeholderNotificationDto);
		log.info(stakeholderNotificationDto.message());
	}
}
