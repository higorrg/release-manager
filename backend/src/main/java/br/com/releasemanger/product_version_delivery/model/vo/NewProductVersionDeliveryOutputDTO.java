package br.com.releasemanger.product_version_delivery.model.vo;

import java.net.URI;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record NewProductVersionDeliveryOutputDTO(
		Long versionId,
		Long productId,
		String productName,
		String versionString,
		Long versionStatusId,
		String versionStatusName,
		URI artifact,
		LocalDateTime timestamp) {

}
