package br.com.releasemanger.version_label.service;

import br.com.releasemanger.product.model.entity.Product;

public class VersionLabelStrategyRevision implements VersionLabelStrategy {

	@Override
	public void setNewVersion(Product product) {
		product.setRevisionVersion(product.getRevisionVersion() + 1);
	}

}
