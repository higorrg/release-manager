package br.com.releasemanger.product_version_delivery.resource;

import java.io.IOException;

import br.com.releasemanger.product_version_delivery.model.vo.NewProductVersionDeliveryInputDTO;
import br.com.releasemanger.product_version_delivery.service.NewProductVersionDeliveryService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("products/{productId}")
public class NewProductVersionDeliveryResource {

	@Inject
	private NewProductVersionDeliveryService newVersionService;

	/**
	 * User story US-004, in which a Continuous Delivery tools like Jenkins, upload
	 * the software artifact, setting the version number according to its DevOps
	 * (SDLC) flow.
	 * 
	 * @param newVersionDTO
	 * @return
	 * @throws IOException
	 */
	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadNewVersion(@PathParam("productId") Long productId, NewProductVersionDeliveryInputDTO newVersionDTO)
			throws IOException {
		return Response.ok(this.newVersionService.publishNewVersion(productId, newVersionDTO))
				.build();
	}

}
