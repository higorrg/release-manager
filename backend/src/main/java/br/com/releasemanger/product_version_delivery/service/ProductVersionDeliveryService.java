package br.com.releasemanger.product_version_delivery.service;

import java.util.List;
import java.util.stream.Collectors;

import br.com.releasemanger.product_version_delivery.model.entity.ProductVersionDelivery;
import br.com.releasemanger.product_version_delivery.model.vo.ProductVersionDeliveryDTO;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;

@Dependent
public class ProductVersionDeliveryService {

	@Inject
	private DownloadUrlBuilder downloadUrlBuilder;

	public List<ProductVersionDeliveryDTO> getVersionsByProduct(Long productId) {
		List<ProductVersionDelivery> queryResult = ProductVersionDelivery.list("productId = ?1", productId);
		List<ProductVersionDeliveryDTO> dtoList = queryResult.stream().map(version -> this.buildVersionDTO(version))
				.collect(Collectors.toList());
		return dtoList;
	}

	private ProductVersionDeliveryDTO buildVersionDTO(ProductVersionDelivery version) {
		return ProductVersionDeliveryDTO.builder()
				.id(version.getId())
				.versionStatus(version.getVersionStatus())
				.versionCreatedTimestamp(version.getVersionCreatedTimestamp())
				.version(version.getVersionString())
				.releaseNotes(version.getReleaseNotes())
				.prerequisite(version.getPrerequisite())
				.artifact(downloadUrlBuilder.buildUrl(version))
				.build();
	}
}
