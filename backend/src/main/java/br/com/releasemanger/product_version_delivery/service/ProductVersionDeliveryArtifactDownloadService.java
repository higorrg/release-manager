package br.com.releasemanger.product_version_delivery.service;

import java.io.File;

import br.com.releasemanger.product_version_delivery.model.entity.ProductVersionDelivery;
import jakarta.enterprise.context.Dependent;

@Dependent
public class ProductVersionDeliveryArtifactDownloadService {

	public File getFile(Long versionId) {
		ProductVersionDelivery version = this.findVersionById(versionId);
		return new File(version.getArtifactLocation());
	}

	public ProductVersionDelivery findVersionById(Long versionId) {
		return ProductVersionDelivery.findById(versionId);
	}


}
