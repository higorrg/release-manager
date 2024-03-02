package org.hibernate.converter;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class DurationConverter implements AttributeConverter<Duration, Long> {

	@Override
	public Long convertToDatabaseColumn(Duration attribute) {
		if (attribute == null) {
			return null;
		}
		return attribute.toNanos();
	}

	@Override
	public Duration convertToEntityAttribute(Long duration) {
		if (duration == null) {
			return null;
		}
		return Duration.of(duration, ChronoUnit.NANOS);
	}
}