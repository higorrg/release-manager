package com.empresa.releasemanager.release.adapter.in.dto;

import com.empresa.releasemanager.release.domain.model.Environment;
import com.empresa.releasemanager.release.domain.model.Release;
import com.empresa.releasemanager.release.domain.model.ReleaseStatus;
import com.empresa.releasemanager.release.domain.model.VersionType;

import java.time.LocalDateTime;
import java.util.List;

public record ReleaseResponse(
    Long id,
    String productName,
    String version,
    VersionType versionType,
    ReleaseStatus status,
    String branchName,
    String commitHash,
    String releaseNotes,
    String prerequisites,
    String packageUrl,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    String createdBy,
    String updatedBy,
    List<StatusHistoryResponse> statusHistory,
    List<ClientEnvironmentResponse> clientEnvironments
) {
    public static ReleaseResponse from(Release release) {
        return new ReleaseResponse(
            release.getId(),
            release.getProductName(),
            release.getVersion(),
            release.getVersionType(),
            release.getStatus(),
            release.getBranchName(),
            release.getCommitHash(),
            release.getReleaseNotes(),
            release.getPrerequisites(),
            release.getPackageUrl(),
            release.getCreatedAt(),
            release.getUpdatedAt(),
            release.getCreatedBy(),
            release.getUpdatedBy(),
            release.getStatusHistory().stream()
                .map(StatusHistoryResponse::from)
                .toList(),
            release.getClientEnvironments().stream()
                .map(ClientEnvironmentResponse::from)
                .toList()
        );
    }

    public record StatusHistoryResponse(
        Long id,
        ReleaseStatus previousStatus,
        ReleaseStatus newStatus,
        String reason,
        String changedBy,
        LocalDateTime changedAt
    ) {
        public static StatusHistoryResponse from(com.empresa.releasemanager.release.domain.model.ReleaseStatusHistory history) {
            return new StatusHistoryResponse(
                history.getId(),
                history.getPreviousStatus(),
                history.getNewStatus(),
                history.getReason(),
                history.getChangedBy(),
                history.getChangedAt()
            );
        }
    }

    public record ClientEnvironmentResponse(
        Long id,
        String clientCode,
        Environment environment,
        LocalDateTime createdAt
    ) {
        public static ClientEnvironmentResponse from(com.empresa.releasemanager.release.domain.model.ReleaseClientEnvironment ce) {
            return new ClientEnvironmentResponse(
                ce.getId(),
                ce.getClientCode(),
                ce.getEnvironment(),
                ce.getCreatedAt()
            );
        }
    }
}