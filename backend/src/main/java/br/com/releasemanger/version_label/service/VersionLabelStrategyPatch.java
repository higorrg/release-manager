package br.com.releasemanger.version_label.service;

import br.com.releasemanger.product.model.entity.Product;

public class VersionLabelStrategyPatch implements VersionLabelStrategy {

	@Override
	public void setNewVersion(Product product) {
		product.setPatchVersion(product.getPatchVersion() + 1);
		product.setRevisionVersion(0);
	}

}
