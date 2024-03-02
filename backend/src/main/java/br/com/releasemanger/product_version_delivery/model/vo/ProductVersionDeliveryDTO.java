package br.com.releasemanger.product_version_delivery.model.vo;

import java.net.URI;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record ProductVersionDeliveryDTO(
		Long id,
		Long versionStatus,
		URI artifact,
		LocalDateTime versionCreatedTimestamp,
		String version,
		String releaseNotes,
		String prerequisite) {

}
