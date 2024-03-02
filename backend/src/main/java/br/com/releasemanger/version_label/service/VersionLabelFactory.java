package br.com.releasemanger.version_label.service;

import br.com.releasemanger.product_version_delivery.model.exceptions.MajorVersionCantBePublishedException;
import br.com.releasemanger.version_label.model.vo.VersionLabel;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class VersionLabelFactory {

	private VersionLabelStrategy minorStrategy = new VersionLabelStrategyMinor();
	private VersionLabelStrategy patchStrategy = new VersionLabelStrategyPatch();
	private VersionLabelStrategy revisionStrategy = new VersionLabelStrategyRevision();

	public VersionLabelStrategy getVersionLabelStrategy(VersionLabel versionLabel) {
		switch (versionLabel) {
		case MINOR:
			return minorStrategy;
		case PATCH:
			return patchStrategy;
		case REVISION:
			return revisionStrategy;
		default:
			throw new MajorVersionCantBePublishedException();
		}
	}

}
