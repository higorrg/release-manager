package br.com.releasemanger.stakeholder_notification.model.vo;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record StakeholderNotificationDTO(
		String stakeholderName,
		String stakeholderRole,
		String stakeholderEmail,
		LocalDateTime notificationTime,
		String message) {

}
