package br.com.releasemanger.product_version_delivery.service;

import java.net.URI;

import br.com.releasemanger.product_version_delivery.model.entity.ProductVersionDelivery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;

@ApplicationScoped
public class DownloadUrlBuilder {

	private static final String DOWNLOAD_URL = "http://%s/products/%d/versions/%d/artifact";

	@Context
	private HttpHeaders httpHeaders;

	public URI buildUrl(ProductVersionDelivery version) {
		return URI.create(DOWNLOAD_URL.formatted(httpHeaders.getHeaderString(HttpHeaders.HOST), version.getProductId(),
				version.getId()));
	}
}
