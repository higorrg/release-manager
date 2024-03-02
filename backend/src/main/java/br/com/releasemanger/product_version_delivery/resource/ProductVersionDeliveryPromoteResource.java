package br.com.releasemanger.product_version_delivery.resource;

import br.com.releasemanger.product_version_delivery.model.vo.ChangeProductVersionDeliveryDTO;
import br.com.releasemanger.product_version_delivery.service.ProductVersionDeliveryPromoteService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("products/{productId}/versions/{versionId}")
public class ProductVersionDeliveryPromoteResource {

	@Inject
	private ProductVersionDeliveryPromoteService versionService;

	/**
	 * User story US-014, in which the user wants promote the version to a new
	 * status, like from Internal do Canary. Also the user can inform the release
	 * notes and the version prerequisites.
	 * 
	 * @param changeVersionDTO
	 * @return
	 */
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeVersionStatus(@PathParam("versionId") Long versionId,
			ChangeProductVersionDeliveryDTO changeVersionDTO) {
		return Response.ok(versionService.promoteVersion(versionId, changeVersionDTO)).build();
	}
}
