package br.com.releasemanger.product_version_delivery.model.vo;

public record ChangeProductVersionDeliveryDTO(
		Long versionStatus,
		String releaseNotes,
		String prerequisite) {

}
