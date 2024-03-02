package br.com.releasemanger.version_status.model.vo;

import java.util.stream.Stream;

public enum VersionStatusValue {

	INTERNAL("Internal"),
	CANARY("Canary"),
	REVOKED("Revoked"),
	GENERAL_AVAILABILITY("General Availability"),
	DEPRECATED("Deprecated");

	private String name;

	VersionStatusValue(String name) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public static final VersionStatusValue findById(Long id) {
		return Stream.of(VersionStatusValue.values()).filter(v -> id.intValue() == v.ordinal()).findFirst()
				.orElseThrow(() -> new IllegalArgumentException("There are no Version Status with id " + id));
	}

}
