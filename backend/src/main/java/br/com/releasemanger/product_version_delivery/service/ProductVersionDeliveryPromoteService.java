package br.com.releasemanger.product_version_delivery.service;

import br.com.releasemanger.product.model.entity.Product;
import br.com.releasemanger.product_version_delivery.model.entity.ProductVersionDelivery;
import br.com.releasemanger.product_version_delivery.model.vo.ChangeProductVersionDeliveryDTO;
import br.com.releasemanger.product_version_delivery.model.vo.NewProductVersionDeliveryOutputDTO;
import br.com.releasemanger.version_status.model.vo.VersionStatusValue;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@Dependent
public class ProductVersionDeliveryPromoteService {

	@Inject
	private VersionStatusNotificationService publishVersionStatusNotification;
	@Inject
	private DownloadUrlBuilder downloadUrlBuilder;

	@Transactional
	public ProductVersionDelivery promoteVersion(Long versionId,
			ChangeProductVersionDeliveryDTO changeVersionStatusDTO) {
		ProductVersionDelivery version = ProductVersionDelivery.findById(versionId);
		version.setVersionStatus(changeVersionStatusDTO.versionStatus());
		version.setReleaseNotes(changeVersionStatusDTO.releaseNotes());
		version.setPrerequisite(changeVersionStatusDTO.prerequisite());
		version.persist();
		NewProductVersionDeliveryOutputDTO versionNotification = this.buildVersionNotification(changeVersionStatusDTO,
				version);
		this.publishVersionStatusNotification.publish(versionNotification);
		return version;
	}

	private NewProductVersionDeliveryOutputDTO buildVersionNotification(
			ChangeProductVersionDeliveryDTO changeVersionStatusDTO, ProductVersionDelivery version) {
		Product product = Product.findById(version.getProductId());
		return NewProductVersionDeliveryOutputDTO.builder()
				.versionId(version.getId())
				.versionString(version.getVersionString())
				.artifact(downloadUrlBuilder.buildUrl(version))
				.timestamp(version.getVersionCreatedTimestamp())
				.productId(version.getProductId())
				.productName(product.getName())
				.versionStatusId(version.getVersionStatus())
				.versionStatusName(VersionStatusValue.findById(version.getId()).getName())
				.build();
	}

}
