package br.com.releasemanger.stakeholder_notification.resource;

import static br.com.releasemanger.version_status.model.vo.VersionStatusNotificationChannel.VERSION_STATUS_NOTIFICATION_SSE;

import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.reactive.messaging.OnOverflow;
import org.jboss.resteasy.reactive.RestStreamElementType;
import org.reactivestreams.Publisher;

import br.com.releasemanger.stakeholder_notification.model.vo.StakeholderNotificationDTO;
import io.quarkus.vertx.ConsumeEvent;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("stakeholder_notification")
public class StakeholderSseResource {

	@Inject
	@Channel(VERSION_STATUS_NOTIFICATION_SSE)
	@OnOverflow(OnOverflow.Strategy.DROP)
	private Emitter<StakeholderNotificationDTO> emitter;

	@Inject
	@Channel(VERSION_STATUS_NOTIFICATION_SSE)
	private Publisher<StakeholderNotificationDTO> publisher;

	@GET
	@Path("/stream")
	@Produces(MediaType.SERVER_SENT_EVENTS)
	@RestStreamElementType(MediaType.APPLICATION_JSON)
	public Publisher<StakeholderNotificationDTO> stream() {
		return this.publisher;
	}

	@ConsumeEvent(VERSION_STATUS_NOTIFICATION_SSE)
	public void consume(StakeholderNotificationDTO stakeholderNotificationDTO) {
		this.emitter.send(stakeholderNotificationDTO);
	}
}
