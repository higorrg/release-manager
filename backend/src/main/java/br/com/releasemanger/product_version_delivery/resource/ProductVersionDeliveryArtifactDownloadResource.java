package br.com.releasemanger.product_version_delivery.resource;

import java.io.File;

import br.com.releasemanger.product_version_delivery.service.ProductVersionDeliveryArtifactDownloadService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("products/{productId}")
public class ProductVersionDeliveryArtifactDownloadResource {

	@Inject
	private ProductVersionDeliveryArtifactDownloadService versionService;

	/**
	 * User story US-007, in which the end user, of a software house, wants to
	 * download the new version, throughout its own software upgrade tool.
	 * 
	 * @param versionId
	 * @return
	 */
	@Path("versions/{versionId}/artifact")
	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public File downloadVersion(@PathParam("productId") Long productId,
			@PathParam("versionId") Long versionId) {
		return versionService.getFile(versionId);
	}
}
