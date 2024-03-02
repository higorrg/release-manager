package br.com.releasemanger.product_version_delivery.model.exceptions;

import br.com.releasemanger.business_exception.BusinessException;

public class MajorVersionCantBePublishedException extends BusinessException {

	private static final long serialVersionUID = 1L;

	public MajorVersionCantBePublishedException() {
		super("Major version can't be published");
	}

}
