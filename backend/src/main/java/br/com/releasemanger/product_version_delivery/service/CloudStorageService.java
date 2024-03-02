package br.com.releasemanger.product_version_delivery.service;

import java.io.File;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/")
@RegisterRestClient(configKey = "cloud-storage")
public interface CloudStorageService {

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	Response upload(@FormParam("productId") Long productId,
			@FormParam("versionId") String versionId,
			@FormParam("file") File file);

}
