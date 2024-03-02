package br.com.releasemanger.business_exception;

import io.vertx.core.json.JsonObject;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;

public class BusinessExceptionHandler implements ExceptionMapper<BusinessException> {

	@Override
	public Response toResponse(BusinessException exception) {
		return Response.status(Status.BAD_REQUEST)
				.entity(JsonObject.of("business-exception", exception.getMessage()))
				.build();
	}

}
